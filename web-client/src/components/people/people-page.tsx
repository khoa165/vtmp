import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Button, Checkbox, TextField } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { FaArrowUpWideShort, FaArrowDownWideShort } from 'react-icons/fa6';
import { useSearchParams } from 'react-router-dom';

import { MentorshipRole } from '@vtmp/common/constants';

import { PeopleGrid } from '#vtmp/web-client/components/people/people-grid';
import { useMentorshipPeople } from '#vtmp/web-client/hooks/useMentorshipPeople';
import { useNavigatePreserveQueryParams } from '#vtmp/web-client/hooks/useNavigatePreserveQueryParams';
import { useOffersData } from '#vtmp/web-client/hooks/useOffersData';
import { PeopleSortColumn } from '#vtmp/web-client/utils/constants';
import { DEFAULT_ROLES, getRoleDisplayName } from '#vtmp/web-client/utils/data';
import { peopleSortColumnDisplayName } from '#vtmp/web-client/utils/display-name';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface PeoplePageProps {
  year: number | 'all';
}

export const PeoplePage: React.FC<PeoplePageProps> = ({ year }) => {
  const navigate = useNavigatePreserveQueryParams();
  const [filterParams, setFilterParams] = useSearchParams();

  const filteredRoles = useMemo(() => {
    const selectedRoles = filterParams.get('roles');
    return selectedRoles != null
      ? (selectedRoles
          .split(',')
          .filter((r) => r in MentorshipRole) as MentorshipRole[])
      : DEFAULT_ROLES;
  }, [filterParams]);

  const getSortColumn = (sort: string | null): PeopleSortColumn => {
    if (sort?.toLowerCase() === PeopleSortColumn.NAME.toLowerCase()) {
      return PeopleSortColumn.NAME;
    }
    if (sort?.toLowerCase() === PeopleSortColumn.OFFERS_COUNT.toLowerCase()) {
      return PeopleSortColumn.OFFERS_COUNT;
    }
    return PeopleSortColumn.ROLE;
  };

  const [sortColumn, setSortColumn] = useState(
    getSortColumn(filterParams.get('sort'))
  );
  const [sortDescending, setSortDescending] = useState(
    (filterParams.get('direction')?.toLowerCase() ?? 'desc') === 'desc'
  );

  const onChangeSort = (_event, value) => {
    setFilterParams((params) => {
      params.set('sort', value);
      return params;
    });
    setSortColumn(getSortColumn(value));
  };
  const onToggleSortDirection = () => {
    const isDescendingNew = !sortDescending;
    setFilterParams((params) => {
      params.set('direction', isDescendingNew ? 'DESC' : 'ASC');
      return params;
    });
    setSortDescending(isDescendingNew);
  };

  const people = useMentorshipPeople(
    year,
    sortColumn,
    sortDescending,
    filteredRoles
  );
  const companiesMetadata = useOffersData();

  const totalOffers = useMemo(
    () =>
      people.reduce((p, c) => {
        const currentTerm = c.terms.find((t) => t.year === year);
        return p + (currentTerm?.offers?.length ?? 0);
      }, 0),
    [people, year]
  );

  const onChangeYear = (_event, value) => navigate(`/people/${value}`);

  const onChangeGroup = (_event, value) => {
    if (value.length === 0) {
      setFilterParams((params) => {
        params.delete('roles');
        return params;
      });
      return;
    }
    setFilterParams((params) => {
      params.set('roles', value.join(','));
      return params;
    });
  };

  const mentorshipYears = ['all' as const, 2023, 2024, 2025];
  const yearDisplay = (year: (typeof mentorshipYears)[number]) => {
    if (year === 'all') {
      return 'All Years';
    }
    return year.toString();
  };

  return (
    <div id="people-page" className="px-[10vw] py-5">
      <div className="flex flex-wrap items-center justify-between gap-4 md:gap-1 mb-8">
        <div className="w-full lg:flex-1 mr-4">
          <Autocomplete
            className="role-control"
            multiple
            options={DEFAULT_ROLES}
            getOptionLabel={(option) =>
              getRoleDisplayName(option as MentorshipRole)
            }
            renderInput={(params) => <TextField {...params} label="Role" />}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {getRoleDisplayName(option as MentorshipRole)}
                </li>
              );
            }}
            defaultValue={filteredRoles}
            onChange={onChangeGroup}
          />
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-4 lg:flex-none">
          <Autocomplete
            className="year-control flex-1 lg:flex-none"
            sx={{ width: { lg: 125 } }}
            options={mentorshipYears}
            getOptionLabel={(option) => yearDisplay(option)}
            renderInput={(params) => <TextField {...params} label="Year" />}
            defaultValue={year}
            onChange={onChangeYear}
            disableClearable
          />
          <Autocomplete
            className="sort-control flex-1 lg:flex-none"
            sx={{ width: { lg: 160 } }}
            options={Object.keys(PeopleSortColumn)}
            getOptionLabel={(option) => peopleSortColumnDisplayName[option]}
            renderInput={(params) => <TextField {...params} label="Sort" />}
            defaultValue={sortColumn}
            onChange={onChangeSort}
            disableClearable
          />
          <div className="direction-control w-[52px]">
            <Button
              variant="outlined"
              onClick={onToggleSortDirection}
              className="!h-[52px] !min-w-[52px] !w-full"
            >
              {sortDescending ? (
                <FaArrowDownWideShort />
              ) : (
                <FaArrowUpWideShort />
              )}
            </Button>
          </div>
        </div>
      </div>
      {totalOffers >= 10 && (
        <h3 className="achievement-text mt-3 text-center text-green">
          {year} cohort achievements so far: {totalOffers} offers
        </h3>
      )}
      {year === 'all' && (
        <h3 className="achievement-text mt-3 text-center text-green">
          Total community members: {people.length} people
        </h3>
      )}
      <PeopleGrid
        people={people}
        year={year}
        companiesMetadata={companiesMetadata}
        sortColumn={sortColumn}
      />
    </div>
  );
};
