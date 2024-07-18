import { FieldApi } from '@tanstack/react-form';

export default function FieldInfo({ field }: { field: FieldApi<any,any,any,any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}