import axios from "axios";

const callPythonAI = async (idea) => {

  const response = await axios.post(
    "http://localhost:8000/predict",
    {
      title: idea.title,
      description: idea.description,
      category: idea.category
    }
  );

  return response.data;
};

export default callPythonAI;
