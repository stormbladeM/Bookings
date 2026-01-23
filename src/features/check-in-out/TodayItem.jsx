import styled from "styled-components";
import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import CheckOutButton from "./CheckoutButton";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

function TodayItem({ stay }) {
  const { id, status, guests, numNights, activityType } = stay;
  
  return (
    <StyledTodayItem>
      {/* Activity Type Tags */}
      {activityType === 'arriving' && <Tag type="green">Arriving</Tag>}
      {activityType === 'departing' && <Tag type="blue">Departing</Tag>}
      {activityType === 'checked-out' && <Tag type="silver">Checked Out</Tag>}
      {activityType === 'created' && <Tag type="yellow">New Booking</Tag>}
      
      <Flag src={guests.countryFlag} alt={`Flag of ${guests.nationality}`} />
      <Guest>{guests.fullName}</Guest>
      <div>
        {numNights} night{numNights > 1 ? "s" : ""}
      </div>

      {/* Actions based on activity type */}
      {activityType === 'arriving' && (
        <Button
          size="small"
          variation="primary"
          as={Link}
          to={`/checkin/${id}`}
        >
          Check in
        </Button>
      )}
      {activityType === 'departing' && <CheckOutButton bookingId={id} />}
      {(activityType === 'checked-out' || activityType === 'created') && (
        <Button
          size="small"
          variation="secondary"
          as={Link}
          to={`/bookings/${id}`}
        >
          Details
        </Button>
      )}
    </StyledTodayItem>
  );
}

export default TodayItem;
