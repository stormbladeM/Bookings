import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import CreateBookingForm from "../features/bookings/CreateBookingForm";

function Bookings() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </Row>

      <Row>
        <BookingTable />

        <Modal>
          <Modal.open opens="booking-form">
            <Button>Create new booking</Button>
          </Modal.open>
          <Modal.window name="booking-form">
            <CreateBookingForm />
          </Modal.window>
        </Modal>
      </Row>
    </>
  );
}

export default Bookings;
