import sys
import json
import re

def extract_skills(text: str) -> set:
    # Define a list of common skills; update this list as needed
    skills = {"React JS", "NodeJs", "ExpressJS", "SQL", "Windows Server", "Troubleshooting", "contentful", "strapi", "shopify", "vercel"}
    found_skills = {skill for skill in skills if skill.lower() in text.lower()}
    return found_skills

def extract_experience(text: str) -> dict:
    # Regex to find years of experience, e.g., "1 year", "2 years"
    experience_pattern = re.compile(r'(\d+)\s*(year|years?)', re.IGNORECASE)
    matches = experience_pattern.findall(text)
    total_years = sum(int(year) for year, _ in matches)
    return {"total_years": total_years}

def get_skill_score(resume_text: str, job_description: str) -> float:
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)
    matched_skills = resume_skills & job_skills
    return len(matched_skills) / len(job_skills) if job_skills else 0.0

def get_experience_score(resume_text: str, job_description: str) -> float:
    resume_experience = extract_experience(resume_text)
    job_experience = extract_experience(job_description)
    
    if job_experience["total_years"] == 0:
        return 0.0
    
    experience_score = min(resume_experience["total_years"] / job_experience["total_years"], 1.0)
    return experience_score

def get_education_score(resume_text: str, job_description: str) -> float:
    # Example placeholder logic for education; update as needed
    return 0.0

def get_combined_score(resume_text: str, job_description: str) -> dict:
    skill_score = get_skill_score(resume_text, job_description)
    experience_score = get_experience_score(resume_text, job_description)
    education_score = get_education_score(resume_text, job_description)

    combined_score = (0.4 * skill_score) + (0.3 * experience_score) + (0.3 * education_score)
    
    return {
        "skill_score": skill_score,
        "experience_score": experience_score,
        "education_score": education_score,
        "combined_score": combined_score
    }

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Expected two arguments: resume_text and job_description"}))
        sys.exit(1)
    
    resume_text = sys.argv[1]
    job_description = sys.argv[2]
    scores = get_combined_score(resume_text, job_description)
    print(json.dumps(scores))
