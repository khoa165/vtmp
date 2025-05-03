import React, { useMemo } from 'react';
import {
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  UncontrolledTooltip,
} from 'reactstrap';
import { FaArrowTrendUp, FaCode } from 'react-icons/fa6';
import { RiTeamFill } from 'react-icons/ri';
import { Avatar } from '@/components/layout/avatar';
import { MiniPeopleList } from '@/components/layout/mini-people-list';
import { CompanyMetadataWithOffers, MentorshipPerson } from '@/types';
import {
  getRoleDisplayName,
  isMenteeRole,
  isNewGradOffer,
  isHiddenRole,
  isOrganizerRole,
  isReturnOfferForInternship,
  isReturnOfferForNewGrad,
} from '@/utils/data';
import { useGate } from 'statsig-react';
import { MiniCompaniesList } from '@/components/layout/mini-companies-list';
import { PeopleSortColumn } from '@/utils/constants';
import { useSearchParams } from 'react-router-dom';
import { projectDisplayName } from '@/utils/displayName';

interface PeopleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  year: number | 'all';
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
  const { name, alias, avatar, terms, professionalTitle } = person;
  const firstTerm = useMemo(() => terms[0], [terms]);
  const isOrWasMentee = useMemo(
    () => isMenteeRole(firstTerm.roles),
    [firstTerm]
  );
  const currentTerm = useMemo(
    () => terms.find((t) => t.year === year),
    [terms, year]
  );
  const { mentors, projectAdvisors, teamName, teammates } = currentTerm ?? {};
  const roles = currentTerm?.roles ?? terms.at(-1)?.roles;
  const offers = useMemo(
    () =>
      currentTerm?.offers?.map((o) => {
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
          <CardSubtitle className="flex flex-col gap-y-2">
            <MiniCompaniesList
              offersList={currentTerm?.offers ?? []}
              prefix={alias}
              companiesMetadata={companiesMetadata}
            />
          </CardSubtitle>
        </div>
      )}
      {(mentors || projectAdvisors) && (
        <div className="info-assignment">
          {mentors?.length && (
            <CardSubtitle className="flex justify-end items-center gap-x-2 mt-1">
              <MiniPeopleList peopleList={mentors} prefix={alias} />
              <FaArrowTrendUp id={`${alias}-mentors-icon`} />
              <UncontrolledTooltip
                placement="bottom"
                target={`${alias}-mentors-icon`}
              >
                One-on-one mentors
              </UncontrolledTooltip>
            </CardSubtitle>
          )}

          {projectAdvisors?.length && (
            <CardSubtitle className="flex items-center justify-end gap-x-2 mt-2">
              <MiniPeopleList peopleList={projectAdvisors} prefix={alias} />
              <FaCode id={`${alias}-advisors-icon`} />
              <UncontrolledTooltip
                placement="bottom"
                target={`${alias}-advisors-icon`}
              >
                Project technical mentors
              </UncontrolledTooltip>
            </CardSubtitle>
          )}

          {teamName && teammates && (
            <CardSubtitle className="flex gap-x-2 mt-2">
              <div className="flex flex-col gap-y-2">
                <MiniPeopleList peopleList={teammates} prefix={alias} />
              </div>
              <div className="mt-1">
                <RiTeamFill id={`${alias}-teammates-icon`} />
                <UncontrolledTooltip
                  placement="bottom"
                  target={`${alias}-teammates-icon`}
                >
                  Teammates / {projectDisplayName[teamName]}
                </UncontrolledTooltip>
              </div>
            </CardSubtitle>
          )}
        </div>
      )}
      <Avatar url={avatar} />
      <CardBody>
        <CardTitle>{name}</CardTitle>
        {roles && isOrganizerRole(roles) && (
          <CardSubtitle>
            {roles
              .filter((r) => !isHiddenRole(r, roles))
              .map(getRoleDisplayName)
              .join(' / ')}
          </CardSubtitle>
        )}
        <hr />
        <CardSubtitle className="people-title">
          {professionalTitle}
        </CardSubtitle>
        {/* <CardSubtitle>{hobbies}</CardSubtitle> */}
      </CardBody>
    </Card>
  );
};
