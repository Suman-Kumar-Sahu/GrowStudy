import { useState } from "react";

const initialFormState = {
  title: "",
  company: "",
  description: "",
  skillsRequired: "",
  location: "",
  stipend: "",
  responsibilities: "",
  requirements: ""
};

export const useJobForm = () => {
  const [form, setForm] = useState(initialFormState);

  const resetForm = () => setForm(initialFormState);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const processFormData = () => {
    const skillsArray = form.skillsRequired.split(",").map(s => s.trim());
    
    const responsibilitiesArray = form.responsibilities
      .split("\n")
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(r => r.replace(/^-\s*/, ""));
    
    const requirementsArray = form.requirements
      .split("\n")
      .map(r => r.trim())
      .filter(r => r.length > 0)
      .map(r => r.replace(/^-\s*/, ""));

    return {
      ...form,
      skillsRequired: skillsArray,
      responsibilities: responsibilitiesArray,
      requirements: requirementsArray
    };
  };

  return { form, setForm, resetForm, updateForm, processFormData };
};