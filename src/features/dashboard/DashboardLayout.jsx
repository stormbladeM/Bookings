import styled from "styled-components";
import { useRecentBookings } from "./useRecentBookings";
import Spinner from "../../ui/Spinner";
import { useRecentStay } from "./useRecentStay";
import Stats from "./stats";
import { useCabins } from "../cabins/useCabins";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;
function DashboardLayout() {
  const { bookings, isLoading } = useRecentBookings();
  const { stays, isLoading: isLoading2, confirmedStays,numDays } = useRecentStay();
  const {cabins,isLoading:isLoading3} = useCabins();
  if (isLoading || isLoading2 || isLoading3) {
    return <Spinner />;
  }
  return (
    <StyledDashboardLayout>
      <Stats bookings={bookings} confirmedStays={confirmedStays} numDays={numDays} cabinCount={cabins.length} />
      <div>Statistics</div>
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
