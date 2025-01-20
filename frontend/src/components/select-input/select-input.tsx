import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Item {
  value: string;
  label: string;
}


interface SelectInputProps {
  value: string;
  options: {
    title: string;
    items: Item[];
  }[];
  onChange?: (value: string) => void;
  placeholder?: string;
  params?: React.ComponentPropsWithoutRef<typeof Select>;
  className?: string;
  onBlur?: () => void
  disabled?: boolean
}

export function SelectInput({
  value,
  options,
  onChange,
  placeholder,
  onBlur,
  disabled,
  ...params
}: SelectInputProps) {
  return (
    <Select value={value} onValueChange={onChange} defaultValue={value} {...params} disabled={disabled} >
      <SelectTrigger onBlur={onBlur}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="z-50"
        style={{ zIndex: 9999 }}
      >
        <SelectGroup>
          {options.map((e) => (
            <React.Fragment key={e.title}>
              <SelectLabel>{e.title}</SelectLabel>
              {e.items.map((i) => (
                <SelectItem key={i.value} value={i.value}>
                  {i.label}
                </SelectItem>
              ))}
            </React.Fragment>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
