import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Textarea } from "~/components/ui/textarea";

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: { Input, Select, Textarea },
  formComponents: { Button },
  fieldContext,
  formContext,
});

export default useAppForm;