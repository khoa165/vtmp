import React, { useMemo } from 'react';
import {
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  UncontrolledTooltip,
} from 'reactstrap';
import { FaArrowTrendUp, FaCode, FaHammer } from 'react-icons/fa6';
import { RiTeamFill } from 'react-icons/ri';
import { Avatar } from 'src/components/layout/avatar';
import { MiniPeopleList } from 'src/components/layout/mini-people-list';
import { CompanyMetadataWithOffers, MentorshipPerson } from 'src/types';
import {
  getRoleDisplayName,
  isMenteeRole,
  isNewGradOffer,
  isHiddenRole,
  isOrganizerRole,
  isReturnOfferForInternship,
  isReturnOfferForNewGrad,
} from 'src/utils/data';
import { useGate } from 'statsig-react';
import { MiniCompaniesList } from 'src/components/layout/mini-companies-list';
import { PeopleSortColumn } from 'src/utils/constants';
import { useSearchParams } from 'react-router-dom';

interface PeopleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  year: number;
  person: MentorshipPerson;
  companiesMetadata: Record<string, CompanyMetadataWithOffers>;
  sortColumn: PeopleSortColumn;
}

export const PeopleCard: React.FC<PeopleCardProps> = ({
  year,
  person,
  companiesMetadata,
  sortColumn,
}) => {
  const { name, alias, avatar, terms } = person;
  const firstTerm = useMemo(() => terms[0], [terms]);
  const isOrWasMentee = useMemo(
    () => isMenteeRole(firstTerm.roles),
    [firstTerm]
  );
  const currentTerm = useMemo(
    () => terms.filter((t) => t.year === year)[0],
    [terms, year]
  );
  const { roles, title, mentors, projectAdvisors, teamName, teammates } =
    currentTerm;
  const offers = useMemo(
    () =>
      currentTerm.offers?.map((o) => {
        if (isReturnOfferForNewGrad(o)) {
          return `${o.name} (NG RO)`;
        } else if (isReturnOfferForInternship(o)) {
          return `${o.name} (IN RO)`;
        } else if (isNewGradOffer(o)) {
          return `${o.name} (NG)`;
        }
        return o.name;
      }),
    [currentTerm]
  );

  const { value: showIndividualOffers, isLoading } = useGate(
    'show_individual_offers'
  );

  const [params] = useSearchParams();

  const showOffers = useMemo(
    () =>
      !isLoading &&
      showIndividualOffers &&
      offers &&
      isOrWasMentee &&
      sortColumn === PeopleSortColumn.OFFERS_COUNT &&
      params.get('vtmp')?.toLowerCase() === 'true',
    [isLoading, showIndividualOffers, offers, isOrWasMentee, sortColumn, params]
  );

  return (
    <Card className="mentorship-people-card">
      {showOffers && (
        <div className="info-offers">
          <CardSubtitle className="app-flex col af-left medium-gap">
            <MiniCompaniesList
              offersList={currentTerm.offers ?? []}
              prefix={alias}
              companiesMetadata={companiesMetadata}
            />
          </CardSubtitle>
        </div>
      )}
      {(mentors || projectAdvisors) && (
        <div className="info-assignment">
          {mentors && (
            <CardSubtitle className="info-mentors app-flex af-right mt-1 mb-2">
              <FaArrowTrendUp id={`${alias}-mentors-icon`} />
              <UncontrolledTooltip
                placement="bottom"
                target={`${alias}-mentors-icon`}
              >
                One-on-one mentors
              </UncontrolledTooltip>
              <MiniPeopleList peopleList={mentors} prefix={alias} />
            </CardSubtitle>
          )}

          {projectAdvisors && (
            <CardSubtitle className="info-advisors app-flex af-right mt-2">
              <FaCode id={`${alias}-advisors-icon`} />
              <UncontrolledTooltip
                placement="bottom"
                target={`${alias}-advisors-icon`}
              >
                Project technical mentors
              </UncontrolledTooltip>
              <MiniPeopleList peopleList={projectAdvisors} prefix={alias} />
            </CardSubtitle>
          )}
        </div>
      )}
      <Avatar url={avatar} />
      <CardBody>
        <CardTitle>{name}</CardTitle>
        {isOrganizerRole(roles) && (
          <CardSubtitle>
            {roles
              .filter((r) => !isHiddenRole(r, roles))
              .map(getRoleDisplayName)
              .join(' / ')}
          </CardSubtitle>
        )}
        {teammates && (
          <div className="app-flex mt-2">
            <FaHammer id={`${alias}-build-icon`} /> {teamName}
            <UncontrolledTooltip
              placement="bottom"
              target={`${alias}-build-icon`}
            >
              Group project
            </UncontrolledTooltip>
            <RiTeamFill id={`${alias}-teammates-icon`} />
            <UncontrolledTooltip
              placement="bottom"
              target={`${alias}-teammates-icon`}
            >
              Teammates
            </UncontrolledTooltip>
            <MiniPeopleList peopleList={teammates} prefix={alias} />
          </div>
        )}
        <hr />
        <CardSubtitle className="people-title">{title}</CardSubtitle>
        {/* <CardSubtitle>{hobbies}</CardSubtitle> */}
      </CardBody>
    </Card>
  );
};
