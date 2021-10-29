/* eslint-disable import/no-named-default */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import Box from '@codeday/topo/Atom/Box';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { default as Select } from '@codeday/topo/Atom/Input/Select';
import { DateTime } from 'luxon';

export default function MonthYearPicker({ defaultValue, onChange, ...rest }) {
  const defaultDt = typeof defaultValue === 'string' ? DateTime.fromISO(defaultValue) : defaultValue;
  const [month, setMonth] = useState(defaultDt?.toLocaleString({ month: 'numeric' }) || '1');
  const [year, setYear] = useState(defaultDt?.toLocaleString({ year: 'numeric' }) || '');
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) initialRender.current = false;
    else if (month && year.length === 4) onChange(DateTime.fromObject({ day: 1, month, year }).toISO());
    else if (year.length === 0 && !month) onChange(null);
  }, [month, year]);

  return (
    <Box {...rest}>
      <Select
        d="inline-block"
        width="45%"
        maxWidth="7em"
        defaultValue={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value=""></option>
        {[...Array(13).keys()].slice(1).map((monthNumber) => (
          <option key={monthNumber} value={monthNumber.toString()}>
            {DateTime.now().set({ month: monthNumber }).toLocaleString({ month: 'short' })}
          </option>
        ))}
      </Select>
      <Input
        d="inline-block"
        width="45%"
        ml={1}
        maxWidth="5em"
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => {
          const val = e.target.value;
          if (!Number.parseInt(val, 10).toString() === val) return;
          setYear(val);
        }}
      />
    </Box>
  );
}
