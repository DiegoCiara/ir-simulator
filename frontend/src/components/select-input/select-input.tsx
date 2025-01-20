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
  onChange: (value: string) => void; // Função chamada ao mudar o valor
  placeholder?: string; // Placeholder opcional
  params?: React.ComponentPropsWithoutRef<typeof Select>; // Props adicionais para o SelectTrigger
  className?: string; // ClassName opcional para o SelectTrigger
}

export function SelectInput({
  value,
  options,
  onChange,
  placeholder,
  ...params
}: SelectInputProps) {
  return (
    <Select value={value} onValueChange={onChange} defaultValue={value} {...params} >
      <SelectTrigger >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      {/* Usando Portal para garantir que o conteúdo é renderizado no body */}
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
