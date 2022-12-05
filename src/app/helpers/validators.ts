import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const atLeastOne = (validator: ValidatorFn, controls: string[] = []) => (
    group: FormGroup,
): ValidationErrors | null => {
    if (!controls) {
        controls = Object.keys(group.controls)
    }

    const hasAtLeastOne = group && group.controls && controls
        .some(k => !validator(group.controls[k]));

    return hasAtLeastOne ? null : {
        atLeastOne: true,
    };
};

export function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return new Date(control.value) <= new Date() ? { futureDate: { value: control.value } } : null;
    };
}

export function conditionalValidator(conditions: { [key: string]: any }, validators: ValidatorFn[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        for (const [controlName, controlValue] of Object.entries(conditions)) {
            if (control.parent?.get(controlName)?.value !== controlValue) {
                return null;
            }
        }
        for (const validator of validators) {
            let resp = validator(control);
            if (resp) return { conditionalValidator: resp };
        }
        return null;
    };
}