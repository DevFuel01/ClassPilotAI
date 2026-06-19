import json
import logging
from typing import List, Optional
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from google.genai.errors import APIError
from app.config import settings
from app.services.safety import sanitize_input, build_safe_system_instruction

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Pydantic Models for Structured LLM Outputs ---

class TableRow(BaseModel):
    parameter: str = Field(..., description="Key feature, phase, or item to compare.")
    detail: str = Field(..., description="Details or values related to this parameter.")

class LessonContext(BaseModel):
    current_topic: Optional[str] = Field(default=None, description="The title/topic of the current simplified lesson.")
    explanation: Optional[str] = Field(default=None, description="The simple Hinglish explanation text of the lesson.")
    keywords: Optional[List[str]] = Field(default_factory=list, description="Keywords discussed in the lesson.")
    summary: Optional[str] = Field(default=None, description="One-sentence summary of the lesson.")
    key_takeaways: Optional[List[str]] = Field(default_factory=list, description="Key takeaways from the lesson.")
    flowchart_steps: Optional[List[str]] = Field(default_factory=list, description="Step-by-step process flow of the lesson.")
    fun_fact: Optional[str] = Field(default=None, description="Fun fact shared about the topic.")
    real_life_example: Optional[str] = Field(default=None, description="Real life example shared about the topic.")

class ConceptResponse(BaseModel):
    title: str = Field(..., description="The title of the concept (e.g., Photosynthesis)")
    explanation: str = Field(..., description="A simple explanation of the concept in a Hinglish/friendly tone suitable for primary/middle school students.")
    keywords: List[str] = Field(..., description="3-5 key scientific words related to the topic.")
    diagram_suggestion: str = Field(..., description="Detailed design instruction for an SVG diagram representing this concept. Describe layers, colors, and layout (e.g. 'draw a sun radiating yellow lines to a green leaf...').")
    fun_fact: str = Field(..., description="An interesting or surprising fun fact about the concept.")
    real_life_example: str = Field(..., description="A daily life scenario where students can observe or experience this concept.")
    summary: str = Field(..., description="A one-sentence summary of the concept.")
    audio_text: str = Field(..., description="The exact text to be read aloud to the classroom. Should be in simple Hinglish, polite, warm, and highly engaging. Example: 'Namaste bachon! Aaj hum Photosynthesis ke baare mein seekhenge...'")
    flowchart_steps: List[str] = Field(default_factory=list, description="3-4 brief sequential steps showing how this process works from start to end.")
    comparison_table: List[TableRow] = Field(default_factory=list, description="A 3-row comparison or key parameter table summarizing the concept details.")
    key_takeaways: List[str] = Field(default_factory=list, description="3 key takeaways summarizing the core concepts.")
    classroom_tips: List[str] = Field(default_factory=list, description="3 teacher-focused pedagogical tips or lesson-delivery strategies.")
    analogies: List[str] = Field(default_factory=list, description="2-3 simple analogies comparing the scientific concept to daily-life items/scenarios.")
    teaching_examples: List[str] = Field(default_factory=list, description="3 interactive classroom demos or simple hands-on examples the teacher can execute.")

class QuizQuestion(BaseModel):
    question: str = Field(..., description="The multiple choice question.")
    options: List[str] = Field(..., description="Exactly 4 options for the answer.")
    correct_answer: str = Field(..., description="The exact string of the correct option.")
    explanation: str = Field(..., description="A simple explanation of why this answer is correct in friendly Hinglish.")

class QuizResponse(BaseModel):
    topic: str = Field(..., description="The topic of the quiz.")
    questions: List[QuizQuestion] = Field(..., description="List of 5 MCQ questions.")

class TranslationResponse(BaseModel):
    english_text: str = Field(..., description="The original or translated English text.")
    hindi_text: str = Field(..., description="The Hindi translation (in Devnagari script).")
    hinglish_text: str = Field(..., description="The Hinglish translation (Hindi written in Latin script, like 'Yeh ek sundar din hai').")
    audio_text: str = Field(..., description="A clear text script to read aloud the translation in the selected language.")

class ActivityGuideResponse(BaseModel):
    title: str = Field(..., description="Title of the group activity.")
    duration_seconds: int = Field(..., description="Total time for the activity (usually 300 seconds for a 5-minute activity).")
    steps: List[str] = Field(..., description="Step-by-step instructions for the students, easy to read on the board.")
    materials: List[str] = Field(..., description="List of simple items needed (e.g., paper, pencils, bottle).")
    voice_intro: str = Field(..., description="Polite Hinglish introduction to read aloud, telling the class to prepare for the activity.")
    completion_message: str = Field(..., description="Polite Hinglish message to read aloud when the activity completes.")

# --- Service Class ---

class GeminiService:
    def __init__(self):
        self.client = None
        if not settings.IS_MOCK_MODE:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
                logger.info("Gemini Client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Client: {e}. Switching to mock mode.")
                settings.IS_MOCK_MODE = True
        else:
            logger.info("Initializing in Mock Mode (No Gemini API Key provided).")

    def generate_concept(self, concept_name: str) -> ConceptResponse:
        # Sanitize input before processing
        concept_name = sanitize_input(concept_name)
        if settings.IS_MOCK_MODE:
            return self._get_mock_concept(concept_name)
        
        base_instruction = (
            "You are ClassPilot AI, a science teaching assistant for government school students in India (Class 5–8). "
            "Explain concepts using simple Hinglish/English code-switching, everyday analogies, and structured educational content. "
            "Never speculate or state unverified facts."
        )
        prompt = f"""
        Explain the scientific or educational concept: '{concept_name}' for government school students in India.
        Keep the tone polite, engaging, and encourage active listening.
        Explain using everyday analogies and simple Hinglish/English code-switching.
        Provide keywords, a detailed SVG diagram recommendation, a fun fact, a real-life example, a clean summary, and 3 key takeaways.
        Provide a voice script in 'audio_text' that is conversational, polite, and uses code-switching.
        Also provide 3 practical classroom tips for the teacher, 2-3 relatable everyday analogies, and 3 interactive teaching examples/experiments.
        """
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ConceptResponse,
                    system_instruction=build_safe_system_instruction(base_instruction),
                    temperature=0.7
                )
            )
            return ConceptResponse.model_validate_json(response.text)
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}. Falling back to mock data.")
            return self._get_mock_concept(concept_name)

    def generate_quiz(self, topic: str, lesson_context: Optional[LessonContext] = None) -> QuizResponse:
        # Sanitize input
        topic = sanitize_input(topic)
        if settings.IS_MOCK_MODE:
            return self._get_mock_quiz(topic, lesson_context)

        prompt = f"Create a five-question multiple-choice quiz about: '{topic}'.\n"
        if lesson_context:
            prompt += (
                f"Use the following lesson context to tailor the questions to what was taught:\n"
                f"Explanation: {lesson_context.explanation or ''}\n"
                f"Key Takeaways: {', '.join(lesson_context.key_takeaways or [])}\n"
                f"Flowchart Steps: {', '.join(lesson_context.flowchart_steps or [])}\n"
                f"Real-life Example: {lesson_context.real_life_example or ''}\n\n"
            )
        prompt += """
        The questions should be appropriate for primary or middle school school students.
        For each question, provide 4 options, the correct answer (matching one of the options exactly), and a simple explanation of the correct answer in Hinglish.
        """
        base_instruction = (
            "You are ClassPilot AI. Generate educationally accurate, age-appropriate MCQ quiz questions for Class 5–8 students. "
            "Never include trick questions, violent scenarios, or adult content."
        )
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=QuizResponse,
                    system_instruction=build_safe_system_instruction(base_instruction),
                    temperature=0.7
                )
            )
            return QuizResponse.model_validate_json(response.text)
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}. Falling back to mock quiz.")
            return self._get_mock_quiz(topic, lesson_context)

    def generate_translation(self, text: str, target_lang: str = "Hinglish") -> TranslationResponse:
        # Sanitize input
        text = sanitize_input(text)
        if settings.IS_MOCK_MODE:
            return self._get_mock_translation(text, target_lang)

        base_instruction = (
            "You are ClassPilot AI. Provide accurate, polite, classroom-appropriate translations "
            "for Indian government school students. Never translate adult, violent, or offensive content."
        )
        prompt = f"""
        Translate the following text into English, Hindi (Devnagari script), and Hinglish (Hindi text in Latin script).
        Text to translate: "{text}"
        Make the translation sound natural, polite, and classroom-appropriate.
        In the 'audio_text' field, provide the translation corresponding to the target language '{target_lang}' to be read aloud.
        """
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=TranslationResponse,
                    system_instruction=build_safe_system_instruction(base_instruction),
                    temperature=0.3
                )
            )
            return TranslationResponse.model_validate_json(response.text)
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}. Falling back to mock translation.")
            return self._get_mock_translation(text, target_lang)

    def generate_activity(self, topic: str, duration_minutes: int = 5) -> ActivityGuideResponse:
        # Sanitize input
        topic = sanitize_input(topic)
        if settings.IS_MOCK_MODE:
            return self._get_mock_activity(topic, duration_minutes)

        base_instruction = (
            "You are ClassPilot AI. Design safe, fun, hands-on classroom group activities for Class 5–8 Indian school students. "
            "Use only materials available in a government school. Activities must be non-violent and inclusive."
        )
        prompt = f"""
        Create an engaging classroom group activity about '{topic}' lasting {duration_minutes} minutes.
        Provide:
        - A title.
        - Steps that students can follow easily in a group (3-5 steps).
        - A list of simple materials available in a government school classroom.
        - A polite Hinglish introduction voice script in 'voice_intro' to prepare students.
        - A 'completion_message' in Hinglish to say when the time runs out.
        """
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ActivityGuideResponse,
                    system_instruction=build_safe_system_instruction(base_instruction),
                    temperature=0.7
                )
            )
            return ActivityGuideResponse.model_validate_json(response.text)
        except Exception as e:
            logger.error(f"Gemini API call failed: {e}. Falling back to mock activity.")
            return self._get_mock_activity(topic, duration_minutes)

    # --- Fallback Mock Generators ---

    def _get_mock_concept(self, concept_name: str) -> ConceptResponse:
        name_lower = concept_name.lower()
        if "photosynthesis" in name_lower:
            return ConceptResponse(
                title="Photosynthesis (प्रकाश-संश्लेषण)",
                explanation="Photosynthesis ek aisi process hai jisse green plants apna khana banate hain. Plants sunlight (dhoop), water (paani), aur carbon dioxide (hawa) ko lekar glucose (sugar) aur oxygen banate hain. Yeh bilkul waisa hi hai jaise kitchen mein khana banana!",
                keywords=["Sunlight", "Chlorophyll", "Carbon Dioxide", "Glucose", "Oxygen"],
                diagram_suggestion="Draw a green leaf with sun rays coming from the top-left, water drops entering from the bottom-left, CO2 entering from the side, and Oxygen gas exiting from the top-right.",
                fun_fact="Plants only absorb red and blue light for photosynthesis. They reflect green light, which is why leaves appear green to our eyes!",
                real_life_example="Hum jo oxygen saans lete hain aur jo gehu ya chawal hum khate hain, woh sab plants photosynthesis ke through hi banate hain.",
                summary="Plants use sunlight, water, and air to make their own food and release oxygen for us.",
                audio_text="Namaste teachers aur pyare bachon! Aaj hum Photosynthesis ke baare mein seekhenge. Plants apna khana khud banate hain dhoop aur paani ki madad se. Is process ko Photosynthesis kehte hain. Chalo board par leaf ka diagram dekhte hain.",
                flowchart_steps=[
                    "Chlorophyll sunlight (dhoop) ko absorb karta hai",
                    "Roots mitti se water (paani) absorb karti hain",
                    "Leaves air se Carbon Dioxide gas leti hain",
                    "Reaction ke baad Glucose (food) aur Oxygen gas release hoti hai"
                ],
                comparison_table=[
                    TableRow(parameter="Input Requirements", detail="Sunlight, Water, Carbon Dioxide"),
                    TableRow(parameter="Output Products", detail="Glucose (Plant Food) & Oxygen (for humans)"),
                    TableRow(parameter="Reaction Site", detail="Chloroplast organelles inside green cells")
                ],
                key_takeaways=[
                    "Plants require sunlight, carbon dioxide, and water to make food.",
                    "Chlorophyll is the green pigment in leaves that absorbs solar energy.",
                    "Oxygen is released as a byproduct, which is essential for human life."
                ],
                classroom_tips=[
                    "Ask students to observe house plants at home and notice if leaves facing windows grow towards the light.",
                    "Use a simple kitchen analogy: Sunlight is the gas stove, water and CO2 are raw ingredients, and glucose is the prepared dish.",
                    "Perform a quick classroom poll: Ask students why they think leaves are green and transition into explaining chlorophyll."
                ],
                analogies=[
                    "A plant leaf is like a solar-powered kitchen: it uses sunlight to cook food from water and air.",
                    "Chlorophyll acts like solar panels on a roof, capturing energy from the sun to power the cell's activities."
                ],
                teaching_examples=[
                    "Place one small potted plant in a dark cupboard and another on a sunny windowsill. After 3 days, compare their colors and leaf strength with the class.",
                    "Show the class a leaf with a small piece of black paper taped over a section. Explain how blocking sunlight prevents food production in that spot.",
                    "Perform the 'bubble release' demo: Submerge a fresh leaf in warm water and observe the small oxygen bubbles forming on its surface under a lamp."
                ]
            )
        elif "water cycle" in name_lower:
            return ConceptResponse(
                title="Water Cycle (जल चक्र)",
                explanation="Water cycle ka matlab hai paani ka lagatar gol ghumna! Pehle dhoop se nadiya aur talab ka paani bhap (vapor) bankar upar jata hai (Evaporation). Phir woh badal banta hai (Condensation). Aur jab badal bhari ho jate hain, toh baarish bankar wapas zameen par aata hai (Precipitation).",
                keywords=["Evaporation", "Condensation", "Precipitation", "Water Vapor", "Clouds"],
                diagram_suggestion="Draw a sun heating a blue river, vapor arrows pointing up to white clouds, dark clouds raining down onto mountains, and water flowing back into the river.",
                fun_fact="The water you drank today could be the same water that a dinosaur drank millions of years ago! It just keeps recycling.",
                real_life_example="Jab hum gile kapde dhoop mein sukhate hain, toh unka paani hawa mein ud jata hai. Yeh Evaporation ka live example hai.",
                summary="Water continuously circulates between the Earth's surface and the atmosphere through evaporation, condensation, and rain.",
                audio_text="Chalo bachon, aaj hum Water Cycle yani Jal Chakra ke baare mein samajhte hain. Dhoop se paani bhap bankar upar udta hai, phir badal bankar baarish ke roop mein wapas aata hai. Yeh cycle kabhi nahi rukti.",
                flowchart_steps=[
                    "Evaporation: Sun water bodies ko heat up karke vapor banata hai",
                    "Condensation: Vapor skies mein cool down hokar clouds bante hain",
                    "Precipitation: Clouds heavy hokar rain/snow ke roop mein zameen par aate hain",
                    "Collection: Water zameen par flow hokar rivers/oceans mein wapas jata hai"
                ],
                comparison_table=[
                    TableRow(parameter="Evaporation Phase", detail="Water (liquid) turns to Water Vapor (gas) via heat"),
                    TableRow(parameter="Condensation Phase", detail="Water Vapor cools and forms clouds (droplets)"),
                    TableRow(parameter="Precipitation Phase", detail="Clouds release liquid water back to Earth surface")
                ],
                key_takeaways=[
                    "Water continuously circulates between Earth's surface and the atmosphere.",
                    "Sunlight drives the cycle by causing liquid water to evaporate into vapor.",
                    "Condensation forms clouds, which eventually lead to precipitation (rain)."
                ],
                classroom_tips=[
                    "Relate evaporation to drying school uniforms on a sunny day vs. a cloudy day.",
                    "Ask students if they have noticed water droplets on the outside of a cold metal glass or cup, and explain condensation.",
                    "Have a student draw the three main steps on the blackboard in a circular loop to visualize the 'cycle'."
                ],
                analogies=[
                    "The water cycle is like a giant planetary recycling machine that has been reusing the exact same water for billions of years.",
                    "Think of clouds as wet sponges in the sky: when they get squeezed too tight by cold air, they release water as rain."
                ],
                teaching_examples=[
                    "The 'Water Cycle in a Bag' demo: Draw a cloud and water on a zip-lock bag, fill it with a little water, tape it to a window, and watch condensation and precipitation form.",
                    "Pour hot water into a glass, cover it with a plate, place ice cubes on top of the plate, and show rain droplets forming underneath.",
                    "Wet a small patch of the blackboard with a sponge and time how long it takes to disappear under the classroom fan (evaporation)."
                ]
            )
        elif "gravity" in name_lower:
            return ConceptResponse(
                title="Gravity (गुरुत्वाकर्षण)",
                explanation="Gravity ek invisible force (adaikshya taqat) hai jo har cheez ko apni taraf kheechti hai. Earth ke paas bahut saari gravity hai, isiliye jab hum ball ko hawa mein phekate hain, toh woh niche aati hai, aur hum zameen par khade reh pate hain.",
                keywords=["Gravity", "Force", "Earth", "Mass", "Isaac Newton"],
                diagram_suggestion="Draw a blue Earth in the center. Show a tree on top with an apple falling down towards the center, and small arrows pointing inward from all sides.",
                fun_fact="Sir Isaac Newton discovered gravity when he saw an apple fall from a tree, wondering why it fell straight to the ground instead of going up!",
                real_life_example="Jab aap jump karte hain, toh aap seedhe zameen par wapas aate hain. Agar gravity nahi hoti, toh aap space mein udte chale jate!",
                summary="Gravity is the invisible force that pulls objects toward each other, keeping us grounded on Earth.",
                audio_text="Namaste bachon! Kya aapne kabhi socha hai ki jab hum ball upar phekate hain toh woh niche hi kyun aati hai? Yeh gravity ke karan hota hai. Gravity dharti ki woh taqat hai jo hume aur har cheez ko pakad kar rakhti hai.",
                flowchart_steps=[
                    "Massive body (jaise Earth) space fabric ko curve karti hai",
                    "Is curvature ke karan mass pull field banta hai",
                    "Choti bodies large objects ki taraf attract hoti hain",
                    "Objects straight zameen ki taraf fall hote hain"
                ],
                comparison_table=[
                    TableRow(parameter="Newton's Law Formula", detail="F = G * (m1 * m2) / r² (Attraction proportional to mass)"),
                    TableRow(parameter="Earth Acceleration rate", detail="g = 9.8 m/s² (Standard acceleration on Earth surface)"),
                    TableRow(parameter="Key Significance", detail="Keeps atmosphere, water, and humans bound to ground")
                ],
                key_takeaways=[
                    "Gravity is the invisible pulling force that keeps us grounded on Earth.",
                    "All objects with mass have gravity; the greater the mass, the stronger the pull.",
                    "Gravity keeps the Earth in orbit around the Sun and holds our atmosphere in place."
                ],
                classroom_tips=[
                    "Drop two objects of different weights (e.g. a book and a crumpled paper ball) to show they fall at the same rate, dispelling the heavy-falls-faster myth.",
                    "Discuss what life would be like in zero gravity (drinking floating water droplets, sleeping strapped to walls).",
                    "Explain that weight is just gravity pulling on our mass, which is why we would weigh less on the Moon."
                ],
                analogies=[
                    "Gravity is like an invisible elastic band connecting you to the Earth, pulling you back down whenever you jump.",
                    "Think of the Earth as a heavy bowling ball sitting on a soft mattress: it creates a dip that draws smaller marbles towards it."
                ],
                teaching_examples=[
                    "Drop a flat sheet of paper and a crumpled sheet of paper at the same time. Discuss how air resistance affects the flat sheet, while gravity acts equally on both.",
                    "Show how a marble rolls around a funnel to demonstrate how planets stay in orbit around the Sun without falling in.",
                    "Use a spring balance scale to weigh a schoolbag and explain that the scale is measuring the earth's gravitational pull on the bag."
                ]
            )
        else:
            # Dynamic generation based on concept name
            title = concept_name.title()
            return ConceptResponse(
                title=f"{title}",
                explanation=f"Aapne '{concept_name}' ke baare mein poocha. Yeh ek bahut hi rochak topic hai! Chalo ise aasan shabdon mein samajhte hain. Yeh ek important scientific concept hai jo hamare aas-paas ki duniya ko chalaney mein help karta hai.",
                keywords=[f"{title}", "Science", "Nature", "Observation"],
                diagram_suggestion=f"Draw a clear diagram depicting the core components of {concept_name} with colored labels and arrows pointing to the main interactions.",
                fun_fact="Science is full of surprises! This concept helps scientists solve complex equations and build technologies we use every day.",
                real_life_example=f"Aap is concept ko rozana life mein observe kar sakte hain jab aap iske effects ko apne aas-paas dekhte hain.",
                summary=f"We are learning about {concept_name} and how it plays an important role in physical science and daily life.",
                audio_text=f"Namaste bachon! Aaj hum {concept_name} ke baare mein baat karenge. Yeh ek behad dilchasp topic hai. Aaiye iske baare mein aasan bhasha mein seekhte hain.",
                flowchart_steps=[
                    f"Step 1: Introduction to {title} core definition",
                    f"Step 2: Flow or interaction of {title} in scientific environments",
                    f"Step 3: Outcome or final impact of {title} in nature"
                ],
                comparison_table=[
                    TableRow(parameter="Concept Name", detail=title),
                    TableRow(parameter="Domain", detail="General Science / Classroom Study"),
                    TableRow(parameter="Relevance", detail="High educational value and daily connection")
                ],
                key_takeaways=[
                    f"Understanding {title} helps explain key processes in physical science.",
                    f"{title} involves interacting inputs and components in a structured sequence.",
                    f"Observing {title} in everyday scenarios connects classroom learning to the real world."
                ],
                classroom_tips=[
                    f"Relate {title} to things students can see, feel, or hear around the school yard.",
                    f"Have students describe {title} in their own words to verify their understanding.",
                    f"Encourage students to ask their parents if they see {title} in action at home."
                ],
                analogies=[
                    f"Understanding {title} is like having a key to open a hidden door of how nature works.",
                    f"{title} acts like a team of players working together to achieve a specific goal in an environment."
                ],
                teaching_examples=[
                    f"Show a short video or picture on the smart board demonstrating the real-world application of {title}.",
                    f"Break the class into small pairs and ask them to brainstorm one question they have about {title}.",
                    f"Create a classroom word-wall of terms related to {title} to reinforce science vocabulary."
                ]
            )

    def _get_mock_quiz(self, topic: str, lesson_context: Optional[LessonContext] = None) -> QuizResponse:
        t_lower = topic.lower()
        if "photosynthesis" in t_lower:
            return QuizResponse(
                topic="Photosynthesis",
                questions=[
                    QuizQuestion(
                        question="Plants apna khana banane ke liye kis gas ka use karte hain?",
                        options=["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
                        correct_answer="Carbon Dioxide",
                        explanation="Plants photosynthesis ke liye Carbon Dioxide saans lete hain aur Oxygen chhodte hain."
                    ),
                    QuizQuestion(
                        question="Leaves ka green color kis pigment ki wajah se hota hai?",
                        options=["Chlorophyll", "Hemoglobin", "Melanin", "Carotene"],
                        correct_answer="Chlorophyll",
                        explanation="Chlorophyll green leaves mein hota hai aur yeh dhoop ko absorb karne mein help karta hai."
                    ),
                    QuizQuestion(
                        question="Photosynthesis ke baad plants kaunsi gas release karte hain jo hum saans lete hain?",
                        options=["Carbon Dioxide", "Nitrogen", "Oxygen", "Helium"],
                        correct_answer="Oxygen",
                        explanation="Oxygen gas hume plants se milti hai jo hume jeene ke liye zaroori hai."
                    ),
                    QuizQuestion(
                        question="Plants ko photosynthesis karne ke liye inme se kya zaroori NAI hai?",
                        options=["Sunlight", "Water", "Carbon Dioxide", "Soil (Mitti)"],
                        correct_answer="Soil (Mitti)",
                        explanation="Soil support ke liye zaroori hai par actual chemical reaction ke liye Sunlight, Water, aur CO2 main cheezein hain. Kuch plants bina mitti ke paani mein bhi grow kar sakte hain (Hydroponics)."
                    ),
                    QuizQuestion(
                        question="Sunlight ki energy ko absorb karne wala leaf ka part kya kehlaata hai?",
                        options=["Stomata", "Chloroplast", "Root", "Stem"],
                        correct_answer="Chloroplast",
                        explanation="Chloroplasts cell ke andar hote hain jisme chlorophyll hota hai jo energy capture karta hai."
                    )
                ]
            )
        else:
            # Standard generic quiz
            return QuizResponse(
                topic=topic.title(),
                questions=[
                    QuizQuestion(
                        question=f"Inme se kaunsa statement {topic} ke baare mein sahi hai?",
                        options=["Yeh sirf raat ko hota hai", "Yeh ek important natural phenomenon hai", "Yeh sirf human beings mein hota hai", "Yeh ek illusion hai"],
                        correct_answer="Yeh ek important natural phenomenon hai",
                        explanation=f"{topic} hamare environment ka ek real aur zaroori hissa hai."
                    ),
                    QuizQuestion(
                        question="Is topic ko study karne ka best method kya hai?",
                        options=["Experiment aur Observation", "Sirf yaad karna", "Ignore karna", "Dosto se ladna"],
                        correct_answer="Experiment aur Observation",
                        explanation="Science ko hamesha experiment karke aur dhyan se dekh kar samajhna chahiye."
                    ),
                    QuizQuestion(
                        question=f"Hum {topic} ko behtar tarike se kaise control ya support kar sakte hain?",
                        options=["Nature ko protect karke", "Pollution badha ke", "Forests ko cut karke", "Kuch na karke"],
                        correct_answer="Nature ko protect karke",
                        explanation="Greenery aur clean environment har scientific cycle ko balance rakhta hai."
                    ),
                    QuizQuestion(
                        question="Scientific concepts ko samajhne se hume kya fayda hota hai?",
                        options=["Hume nayi technology banane mein madad milti hai", "Hume kuch fayda nahi hota", "Hume time waste hota hai", "Hume neend aati hai"],
                        correct_answer="Hume nayi technology banane mein madad milti hai",
                        explanation="Understanding concepts lets us solve real problems and design cool technologies."
                    ),
                    QuizQuestion(
                        question="Is topic se juda sabse important factor kya hai?",
                        options=["Sunlight aur Energy", "Paisa", "Plastics", "Video Games"],
                        correct_answer="Sunlight aur Energy",
                        explanation="Energy is fundamental to almost all natural processes on Earth."
                    )
                ]
            )

    def _get_mock_translation(self, text: str, target_lang: str) -> TranslationResponse:
        # Check translation keywords
        txt_lower = text.lower()
        if "hello" in txt_lower or "how are you" in txt_lower or "welcome to class" in txt_lower:
            english = "Welcome to class, children! Today we will learn a new and interesting topic."
            hindi = "कक्षा में आपका स्वागत है, बच्चों! आज हम एक नया और दिलचस्प विषय सीखेंगे।"
            hinglish = "Class mein aapka swagat hai, bachon! Aaj hum ek naya aur interesting topic seekhenge."
        elif "photosynthesis" in txt_lower:
            english = "Photosynthesis is the process by which green plants prepare their own food using sunlight."
            hindi = "प्रकाश-संश्लेषण वह प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश का उपयोग करके अपना भोजन तैयार करते हैं।"
            hinglish = "Photosynthesis woh process hai jisse green plants sunlight ka use karke apna khana khud banate hain."
        else:
            # General fallback translation
            english = text
            hindi = f"अनुवाद: '{text}' (हिंदी अनुवाद यहाँ दिखाई देगा)"
            hinglish = f"Anuvaad: '{text}' (Hindi written in Latin script will show here)"

        audio_text = english
        if target_lang == "Hindi":
            audio_text = hindi
        elif target_lang == "Hinglish":
            audio_text = hinglish

        return TranslationResponse(
            english_text=english,
            hindi_text=hindi,
            hinglish_text=hinglish,
            audio_text=audio_text
        )

    def _get_mock_activity(self, topic: str, duration_minutes: int) -> ActivityGuideResponse:
        duration_seconds = duration_minutes * 60
        t_title = topic.title()
        
        return ActivityGuideResponse(
            title=f"Group Activity: Explore {t_title}",
            duration_seconds=duration_seconds,
            steps=[
                "Apne dosto ke sath 4-4 ke groups mein divide ho jayein.",
                f"Ek paper par {topic} ke baare mein jo aapne seekha uski drawing banayein.",
                "Har group member diagram ke ek part ko label karega.",
                "Aapas mein discuss karein ki yeh concept hamari real life mein kahan kaam aata hai.",
                "Activity khatam hone par sabhi groups bari-bari apni drawing class ko dikhayein."
            ],
            materials=["Drawing sheets", "Coloured pencils / sketch pens", "Textbook for reference"],
            voice_intro=f"Bachon, ab hum {topic} par ek mazedar activity shuru karne wale hain. Apne groups bana lijiye aur ready ho jayein. Aapke paas pure {duration_minutes} minute hain.",
            completion_message="Time is up! Sabhi bachon ki activity complete ho chuki hai. Bahut badhiya! Ab chalo sabki drawings dekhte hain."
        )
