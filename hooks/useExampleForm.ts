import { useForm } from "react-hook-form";

interface ExampleFormData {
  name: string;
  email: string;
  message: string;
}

export const useExampleForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ExampleFormData>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ExampleFormData) => {
    try {
      // API call logic here
      console.log("Form data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    reset,
  };
};
