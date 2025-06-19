import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import axios from "axios";
import { DeleteIcon, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { errorHandler } from "../../utils";

type TDeleteUserModel = {
  userId: string;
  name: string;
  email: string;
  refetch: () => void;
};

export function DeleteStudentModel({
  userId,

  name,
  email,
  refetch,
}: TDeleteUserModel) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  type deleteStudentSchema = { _id: string };
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<deleteStudentSchema>();

  const onSubmit = async (formDataRaw: deleteStudentSchema) => {
    try {
      console.log(formDataRaw);

      const res = await axios.get(`/api/student/delete?studentId=${userId}`);
      if (res.data.ok) {
        addToast({
          color: "success",
          title: "User Deleted",
        });

        refetch();
        onClose();
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          console.log("cli");
          onOpen();
        }}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Student"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="auto"
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
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  Delete User (userId : {userId})
                </ModalHeader>
                <ModalBody>
                  <p>Are you Sure for Delete Following ?</p>

                  <p>
                    <b>Name :</b> {name}
                  </p>
                  <p>
                    <b>Email :</b> {email}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    type="submit"
                    isLoading={isSubmitting}
                    startContent={<DeleteIcon />}
                  >
                    Delete
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
