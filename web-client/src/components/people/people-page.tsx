import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import 'src/styles/scss/people.scss';
import { DEFAULT_ROLES, getRoleDisplayName } from 'src/utils/data';
import {
  MentorshipYear,
  PeopleSortColumn,
  yearDisplay,
} from 'src/utils/constants';
import { PeopleGrid } from './people-grid';
import { Autocomplete, Button, Checkbox, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useMentorshipPeople } from 'src/hooks/useMentorshipPeople';
import { useOffersData } from 'src/hooks/useOffersData';
import { peopleSortColumnDisplayName } from 'src/utils/displayName';
import { FaArrowUpWideShort, FaArrowDownWideShort } from 'react-icons/fa6';
import { useNavigatePreserveQueryParams } from 'src/hooks/useNavigatePreserveQueryParams';
import { MentorshipRole } from '@common/enums';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface PeoplePageProps {
  year: number;
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
    filterParams.get('direction')?.toLowerCase() === 'desc'
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

  const mentorshipYears = useMemo(
    () => Object.keys(MentorshipYear).map((y) => yearDisplay[y] as number),
    []
  );

  return (
    <div id="people-page">
      <div className="people-page-controls">
        <Autocomplete
          className="role-control flex-fill"
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
        <div className="break d-block d-xl-none"></div>
        <Autocomplete
          className="year-control"
          sx={{ width: 90 }}
          options={mentorshipYears}
          getOptionLabel={(option) => option.toString()}
          renderInput={(params) => <TextField {...params} label="Year" />}
          defaultValue={year}
          onChange={onChangeYear}
          disableClearable
        />
        <Autocomplete
          className="sort-control"
          sx={{ width: 140 }}
          options={Object.keys(PeopleSortColumn)}
          getOptionLabel={(option) => peopleSortColumnDisplayName[option]}
          renderInput={(params) => <TextField {...params} label="Sort" />}
          defaultValue={sortColumn}
          onChange={onChangeSort}
          disableClearable
        />
        <div className="direction-control">
          <Button variant="outlined" onClick={onToggleSortDirection}>
            {sortDescending ? <FaArrowDownWideShort /> : <FaArrowUpWideShort />}
          </Button>
        </div>
      </div>
      {totalOffers >= 10 && (
        <h3 className="achievement-text mt-3 text-center text-green">
          {year} cohort achievements so far: {totalOffers} offers
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
