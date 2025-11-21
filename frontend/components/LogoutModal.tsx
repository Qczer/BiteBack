import ConfirmModal from "./ConfirmModal";
import translate from "@/locales/i18n"

interface LogoutModalProps {
  showConfirm: boolean;
  cancelOnPress: () => void;
  acceptOnPress: () => void;
}

export default function LogoutModal({ showConfirm, cancelOnPress, acceptOnPress }: LogoutModalProps) {
  const tURL = "logoutModal."
  const t = (key: string) => translate(tURL + key);

  return (
    <ConfirmModal
      visible={showConfirm}
      title={t("title")}
      description={t("description")}
      options={[
        {
          label: t("cancelLabel"),
          type: "cancel",
          onPress: cancelOnPress,
        },
        {
          label:t("acceptLabel"),
          type: "danger",
          onPress: acceptOnPress,
        },
      ]}
    />
  )
}