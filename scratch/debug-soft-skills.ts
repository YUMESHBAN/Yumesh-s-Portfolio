import { getSkills, getStackCategories, getSkillShowcases } from "../src/lib/content";
import { loadLocalEnv } from "../scripts/load-env";

loadLocalEnv();

const [skills, categories, showcases] = await Promise.all([
  getSkills(),
  getStackCategories(),
  getSkillShowcases(),
]);

console.log("Categories:", categories.map(c => c.title));
console.log("Skills in Soft Skills:", skills.filter(s => s.category?.toLowerCase() === "soft skills"));
console.log("Showcases for Soft Skills:", showcases.filter(s => s.skill?.category?.toLowerCase() === "soft skills"));

function normalise(value: string) {
  return value.trim().toLocaleLowerCase();
}

function sameSkill(skill: any, reference: any) {
  if (skill._id && reference._id) {
    return skill._id === reference._id;
  }

  return normalise(skill.name) === normalise(reference.name) && normalise(skill.category) === normalise(reference.category ?? "");
}

const categoryData = categories
  .map((category) => ({ ...category, skills: skills.filter((skill) => normalise(skill.category) === normalise(category.title)) }))
  .filter((category) => category.skills.length);

const proofs = categoryData.flatMap((category) =>
  category.skills.flatMap((skill) =>
    showcases
      .filter((showcase) => sameSkill(skill, showcase.skill))
      .map((showcase) => ({ category: category.title, skill: skill.name, showcase: showcase.title })),
  ),
);

console.log("Generated Proofs count:", proofs.length);
console.log("Proofs for Soft Skills:", proofs.filter(p => p.category === "Soft Skills"));
