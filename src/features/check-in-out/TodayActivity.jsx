import styled from "styled-components";

import Heading from "../../ui/Heading";
import Row from "../../ui/Row";
import { useTodayActivity } from "./useTodayActivity";
import Spinner from "../../ui/Spinner";
import TodayItem from "./TodayItem";

const StyledToday = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  grid-column: 1 / span 2;
`;

const TodayList = styled.ul`
  max-height: 32rem;
  overflow-y: auto;
  overflow-x: hidden;

  /* Removing scrollbars for webkit, firefox, and ms, respectively */
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const NoActivity = styled.p`
  text-align: center;
  font-size: 1.6rem;
  font-weight: 500;
  margin-top: 0.4rem;
  color: var(--color-grey-500);
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.4rem 0;
`;

function TodayActivity() {
  const { stays, isLoading } = useTodayActivity();

  if (isLoading) {
    return (
      <StyledToday>
        <Row type="horizontal">
          <Heading as="h2">Today</Heading>
        </Row>
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      </StyledToday>
    );
  }

  const hasActivity = stays && stays.length > 0;

  return (
    <StyledToday>
      <Row type="horizontal">
        <Heading as="h2">Today</Heading>
      </Row>

      {hasActivity ? (
        <TodayList>
          {stays.map((stay) => (
            <TodayItem key={stay.id} stay={stay} />
          ))}
        </TodayList>
      ) : (
        <NoActivity>
          No activity today yet. Create or check in a booking to see it here.
        </NoActivity>
      )}
    </StyledToday>
  );
}

export default TodayActivity;
