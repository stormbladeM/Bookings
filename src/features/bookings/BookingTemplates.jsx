import styled from "styled-components";
import Button from "../../ui/Button";

const TemplatesContainer = styled.div`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const TemplatesTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-grey-700);
`;

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  gap: 1.5rem;
`;

const TemplateCard = styled.div`
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-brand-600);
  }
`;

const TemplateName = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-800);
  margin-bottom: 0.8rem;
`;

const TemplateDescription = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-600);
  margin-bottom: 1.2rem;
  line-height: 1.6;
`;

const TemplateDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 1.3rem;
  color: var(--color-grey-700);
  margin-bottom: 1rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    strong {
      font-weight: 600;
      min-width: 8rem;
    }
  }
`;

const templates = [
  {
    id: "business-trip",
    name: "Business Trip",
    description: "Perfect for short business stays",
    numNights: 2,
    numGuests: 1,
    hasBreakfast: false,
    observations: "Business travel - early check-in preferred",
  },
  {
    id: "weekend-getaway",
    name: "Weekend Getaway",
    description: "Ideal for a relaxing weekend",
    numNights: 3,
    numGuests: 2,
    hasBreakfast: true,
    observations: "Weekend stay - late check-out requested",
  },
  {
    id: "family-vacation",
    name: "Family Vacation",
    description: "Complete family holiday package",
    numNights: 7,
    numGuests: 4,
    hasBreakfast: true,
    observations: "Family with children - requesting adjoining rooms if available",
  },
  {
    id: "romantic-escape",
    name: "Romantic Escape",
    description: "Special occasions and celebrations",
    numNights: 5,
    numGuests: 2,
    hasBreakfast: true,
    observations:
      "Special occasion - anniversary celebration. Requesting room with best view.",
  },
];

function BookingTemplates({ onSelectTemplate }) {
  const handleTemplateClick = (template) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 1); // Tomorrow
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + template.numNights);

    onSelectTemplate({
      ...template,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    });
  };

  return (
    <TemplatesContainer>
      <TemplatesTitle>Quick Booking Templates</TemplatesTitle>
      <TemplatesGrid>
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            onClick={() => handleTemplateClick(template)}
          >
            <TemplateName>{template.name}</TemplateName>
            <TemplateDescription>{template.description}</TemplateDescription>
            <TemplateDetails>
              <span>
                <strong>Duration:</strong> {template.numNights} nights
              </span>
              <span>
                <strong>Guests:</strong> {template.numGuests}
              </span>
              <span>
                <strong>Breakfast:</strong> {template.hasBreakfast ? "Yes" : "No"}
              </span>
            </TemplateDetails>
            <Button size="small" variation="secondary">
              Use Template
            </Button>
          </TemplateCard>
        ))}
      </TemplatesGrid>
    </TemplatesContainer>
  );
}

export default BookingTemplates;
