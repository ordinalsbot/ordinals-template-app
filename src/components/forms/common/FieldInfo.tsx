import { AnyFieldApi } from '@tanstack/react-form';

export default function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? <em>{field.state.meta.errors.join(',')}</em> : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}
