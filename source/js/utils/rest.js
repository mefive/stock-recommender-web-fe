import constants from 'config/constants';

export function shouldShowConfirm(modal, entityName) {
  return modal
    && modal.modalType === constants.MODAL_TYPE_REST_CONFIRM
    && modal.entityName === entityName;
}

export function shouldShowSucc(modal, entityName) {
  return modal
    && modal.modalType === constants.MODAL_TYPE_REST_SUCC
    && modal.entityName === entityName;
}
