"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Student } from "@repo/db/schema";
import axios from "axios";
import { Code, Edit, Mail, Phone, Plus, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { CF_API_BASE_URL, errorHandler } from "../../utils";

type StudentFormModelProps = {
  student?: Student;
  onSubmit: (formData: Student, onClose: () => void) => Promise<void>;
};
export function StudentFormModel({ student, onSubmit }: StudentFormModelProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
    setValue,
  } = useForm<Student>({
    defaultValues: {
      _id: student?._id,
      cf_handle: student?.cf_handle,
      email: student?.email,
      mobileNumber: student?.mobileNumber,
      name: student?.name,
    },
  });

  const onSubmitCommon = async (formData: Student) => {
    try {
      const student = await axios.get(
        CF_API_BASE_URL + `/user.info?handles=${formData.cf_handle}`
      );
      formData.currentRating = student.data.result[0].rating;
      formData.maxRating = student.data.result[0].maxRating;
      formData.mobileNumber = String(formData.mobileNumber);
      console.log({ formData });

      await onSubmit(formData, onClose);
    } catch (error) {
      errorHandler(error);
    }
  };

  let timer: NodeJS.Timeout;
  return (
    <>
      <div>
        {student ? (
          <button
            onClick={onOpen}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Edit Student"
          >
            <Edit className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onOpen}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
        // className="bg-[#f6f9ff]"
        isDismissable={false}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit(onSubmitCommon)}>
                <ModalHeader className="flex flex-col gap-1">
                  Add New Student
                  <div className="flex items-center justify-between p-8 border-b border-slate-200/60">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-soft">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold dark:text-gray-300 dark:text-gray-300 text-slate-900 tracking-tight">
                          {student ? "Edit Student Profile" : "Add New Student"}
                        </h3>
                        <p className="text-sm dark:text-gray-300 text-slate-600">
                          {student
                            ? "Update student information and ratings"
                            : "Enter student details and competitive programming info"}
                        </p>
                      </div>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold dark:text-gray-300 text-slate-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Personal Information
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold dark:text-gray-300 text-slate-700">
                          Codeforces Handle *
                        </label>
                        <div>
                          <Input
                            startContent={
                              <Code className=" dark:text-gray-300 text-slate-400 w-4 h-4" />
                            }
                            variant="bordered"
                            className="premium-input "
                            placeholder="username"
                            {...register("cf_handle")}
                            onChange={(e) => {
                              clearTimeout(timer);
                              timer = setTimeout(async () => {
                                const student = await axios.get(
                                  CF_API_BASE_URL +
                                    `/user.info?handles=${e.target.value}`
                                );

                                if (
                                  student.data.status === "OK" &&
                                  student.data.result[0].firstName.trim()
                                ) {
                                  setValue(
                                    "name",
                                    `${student.data.result[0].firstName} ${student.data.result[0].lastName}`
                                  );
                                }
                              }, 1000);
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold dark:text-gray-300 text-slate-700">
                          Full Name *
                        </label>
                        <div>
                          <Input
                            startContent={
                              <User className=" dark:text-gray-300 text-slate-400 w-4 h-4" />
                            }
                            variant="bordered"
                            className="premium-input "
                            placeholder="Enter full name"
                            {...register("name")}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold dark:text-gray-300 text-slate-700">
                          Email Address *
                        </label>
                        <div>
                          <Input
                            startContent={
                              <Mail className=" dark:text-gray-300 text-slate-400 w-4 h-4" />
                            }
                            variant="bordered"
                            type="email"
                            className="premium-input "
                            placeholder="student@example.com"
                            {...register("email")}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold dark:text-gray-300 text-slate-700">
                          Phone Number *
                        </label>
                        <div>
                          <Input
                            startContent={
                              <Phone className=" dark:text-gray-300 text-slate-400 w-4 h-4" />
                            }
                            variant="bordered"
                            type="tel"
                            className="premium-input "
                            placeholder="+1-555-0123"
                            {...register("mobileNumber")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="success"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    {student ? "Update Student" : "Create Student"}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
