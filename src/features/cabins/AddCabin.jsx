import Button from "../../ui/Button";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";
function AddCabin() {
  return (
    <div>
      <Modal>
        <Modal.open opens="cabin-form">
          <Button>Add New Cabin</Button>
        </Modal.open>
        <Modal.window name="cabin-form">
          <CreateCabinForm />
        </Modal.window>
      </Modal>
    </div>
  );
}

export default AddCabin;

// function AddCabin() {
//   const [isOpenModal, setIsOpenModal] = useState(false);
//   return (
//     <div>
//       <Button
//         onClick={() => {
//           setIsOpenModal((show) => !show);
//         }}
//       >
//         Add new cabins
//       </Button>
//       {isOpenModal && (
//         <Modal onCloseModal={() => setIsOpenModal(false)}>
//           <CreateCabinForm onCloseModal={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }
