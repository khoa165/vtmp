import React, { useMemo } from 'react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/base/tooltip';

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
  const { name, avatar, terms, professionalTitle } = person;
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
    <div className="mentorship-people-card">
      {showOffers && (
        <div className="info-offers">
          <div className="flex flex-col gap-y-2">
            <MiniCompaniesList
              offersList={currentTerm?.offers ?? []}
              companiesMetadata={companiesMetadata}
            />
          </div>
        </div>
      )}
      {(mentors || projectAdvisors) && (
        <div className="info-assignment">
          {mentors && mentors.length > 0 && (
            <div className="flex justify-end items-center gap-x-2 mt-1">
              <MiniPeopleList peopleList={mentors} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <FaArrowTrendUp />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    One-on-one mentors
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {projectAdvisors && projectAdvisors.length > 0 && (
            <div className="flex items-center justify-end gap-x-2 mt-2">
              <MiniPeopleList peopleList={projectAdvisors} />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <FaCode />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Project technical mentors
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {teamName && teammates && teammates.length > 0 && (
            <div className="flex gap-x-2 mt-2">
              <div className="flex flex-col gap-y-2">
                <MiniPeopleList peopleList={teammates} />
              </div>
              <div className="mt-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <RiTeamFill />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Teammates / {projectDisplayName[teamName]}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>
      )}
      <Avatar url={avatar} />
      <div className="p-4">
        <h5 className="text-lg font-medium mb-2">{name}</h5>
        {roles && isOrganizerRole(roles) && (
          <div className="text-sm mb-2">
            {roles
              .filter((r) => !isHiddenRole(r, roles))
              .map(getRoleDisplayName)
              .join(' / ')}
          </div>
        )}
        <hr className="my-3" />
        <div className="text-sm people-title">{professionalTitle}</div>
      </div>
    </div>
  );
};
