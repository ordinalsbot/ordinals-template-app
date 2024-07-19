import { useForm } from '@tanstack/react-form';
import { valibotValidator } from '@tanstack/valibot-form-adapter';
import * as v from 'valibot';
import FieldInfo from '../common/FieldInfo';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const signInFormSchema = v.required(
  v.object({
    email: v.pipe(
      v.string(), 
      v.trim(), 
      v.email()
    ),
    password: v.pipe(
      v.string(), 
      v.trim(), 
      v.minLength(12, 'Password must be at least 12 characters'), 
      v.maxLength(64, 'Password must be less than 64 characters')
    )
  })
);

type TSignInForm = v.InferInput<typeof signInFormSchema>;

export default function SignUp () {

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    onSubmit: async ({ value }: { value: TSignInForm }) => {
      console.log('----- submit!');
      console.log(value);
      
      try {
        v.parse(signInFormSchema, value);
        const { email, password } = value;
        
        const signUpResponse = await createUserWithEmailAndPassword(auth, email, password);
        console.log(signUpResponse);

      } catch (error) {
        console.log('there was an error', error);
      }
    },
    validatorAdapter: valibotValidator()
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name='email'
        children={(field) => {
          const { name, state, handleBlur, handleChange } = field;
          return (
            <>
              <label htmlFor={name}>{name}</label>
              <input
                className='font-black'
                id={name}
                name={name}
                value={state.value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          );
        }}
      />

      <form.Field
        name='password'
        children={(field) => {
          const { name, state, handleBlur, handleChange } = field;
          return (
            <>
              <label htmlFor={name}>{name}</label>
              <input
                id={name}
                className='font-black'
                type='password'
                name={name}
                value={state.value}
                onBlur={handleBlur}
                onChange={(e) => handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button
            type='submit'
            disabled={!canSubmit || isSubmitting}
            className='bg-blue-600 py-2 px-6 rounded-md'
          >
                Sign Up
          </button>
        )}
      />
    </form>
  );
};