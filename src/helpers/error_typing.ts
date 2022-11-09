export function isHttpError(val: Object) {
    return 'status' in val && 'msg' in val;
}