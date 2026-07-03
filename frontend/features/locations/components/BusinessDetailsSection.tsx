import { Feather } from "@expo/vector-icons";
import React from "react";

import { ICON_COLORS } from "../constants";
import { LocationFormErrors, LocationFormState } from "../types";
import { FormTextInput } from "./FormTextInput";
import { SectionCard } from "./SectionCard";

interface Props {
  values: LocationFormState;
  errors: LocationFormErrors;
  onChange: (field: keyof LocationFormState, value: string) => void;
}

export function BusinessDetailsSection({ values, errors, onChange }: Props) {
  return (
    <SectionCard
      icon={<Feather name="briefcase" size={16} color={ICON_COLORS.primary} />}
      title="Business Details"
      subtitle="Core information shown on your public listing"
    >
      <FormTextInput
        label="Location Name"
        placeholder="e.g., Downtown Flagship Store"
        value={values.name}
        onChangeText={(v) => onChange("name", v)}
        error={errors.name}
      />
      <FormTextInput
        label="Full Address"
        placeholder="e.g., 742 Evergreen Terrace"
        value={values.address}
        onChangeText={(v) => onChange("address", v)}
        multiline
        numberOfLines={2}
        className="min-h-[70px]"
        error={errors.address}
      />
      <FormTextInput
        label="Contact Number"
        placeholder="e.g., +1 (555) 123-4567"
        value={values.contact}
        onChangeText={(v) => onChange("contact", v)}
        keyboardType="phone-pad"
        error={errors.contact}
      />
      <FormTextInput
        label="Website URL"
        placeholder="e.g., www.goupworkspace.com"
        value={values.website}
        onChangeText={(v) => onChange("website", v)}
        keyboardType="url"
        autoCapitalize="none"
        error={errors.website}
        className="mb-0"
      />
      <FormTextInput
        label="Business Category"
        placeholder="e.g., Technology, Retail, Services"
        value={values.category}
        onChangeText={(v) => onChange("category", v)}
        error={errors.category}
      />
      <FormTextInput
        label="Business Description"
        placeholder="e.g., 742 Evergreen Terrace"
        value={values.description}
        onChangeText={(v) => onChange("description", v)}
        multiline
        numberOfLines={2}
        className="min-h-[70px]"
        error={errors.description}
      />
      <FormTextInput
        label="Email"
        placeholder="e.g., contact@goupworkspace.com"
        value={values.email}
        onChangeText={(v) => onChange("email", v)}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <FormTextInput
        label="Working Hours"
        placeholder="e.g., 9:00 AM - 5:00 PM"
        value={values.workingHours}
        onChangeText={(v) => onChange("workingHours", v)}
        error={errors.workingHours}
        className="mb-0"
      />
    </SectionCard>
  );
}