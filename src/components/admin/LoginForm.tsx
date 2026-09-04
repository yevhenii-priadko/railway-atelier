"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/admin/actions";

const initialState: ActionState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction}>
      {state.error && <div className="admin-error">{state.error}</div>}
      <div className="admin-field">
        <label htmlFor="password">Пароль</label>
        <input id="password" name="password" type="password" autoFocus required />
      </div>
      <button type="submit" className="admin-btn admin-btn-block" disabled={pending}>
        {pending ? "Входимо…" : "Увійти"}
      </button>
    </form>
  );
}
