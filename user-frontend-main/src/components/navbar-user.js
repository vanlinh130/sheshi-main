import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { COMMISSION_TYPE, MASTER_DATA_NAME, ROLE } from "@/constants";
import commonApis from "@/apis/commonApis";
import errorHelper from "@/utils/error-helper";
import { setProfileAuth } from "@/store/slices/accountSlice";
import successHelper from "@/utils/success-helper";
import AuthApis from "@/apis/authApis";
import configDataApis from "@/apis/configDataApis";
import accountApis from "@/apis/accountApis";
import Compressor from 'compressorjs';
import numberWithCommas from "@/utils/number-with-commas";
import { Badge } from "react-bootstrap";
import commissionApis from "@/apis/commissionApis";

const NavbarUser = () => {
  const { t } = useTranslation();
  const { info } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const refAvatar = useRef();
  const [isUpdateAvatar, setIsUpdateAvatar] = useState(false);
  const [level, setLevel] = useState();
  const [totalBonus, setTotalBonus] = useState(0);
  const [compressedFile, setCompressedFile] = useState(null);
  const [commissionAutomation, setCommissionAutomation] = useState(null);

  const fetchMasterData = async () => {
    const listLevel = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER,
    });
    const bonus = await accountApis.countTotalBonus({ userId: info.id });
    const level = listLevel.find((e) => e.id === info.level);
    setTotalBonus(bonus.data === 0 ? 0 : bonus );
    setLevel(level ? level.name : "USER");
    if (info) {
      const commissionWithLevel = await commissionApis.getListCommissionLevel({
        idLevel: info.level,
      });
      setCommissionAutomation(
        commissionWithLevel?.find(
          (e) => e.commissionConfig?.type === COMMISSION_TYPE.AUTOMATION
        )?.commissionConfig?.commissionName
      );
    }
  };
  
  useEffect(() => {
    fetchMasterData()
  }, [])

  useEffect(() => {
    onChangeAvatar(compressedFile)
  }, [compressedFile])

  const beforeChangeAvatar = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      setIsUpdateAvatar(true);
      new Compressor(file, {
        quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
          // compressedResult has the compressed file.
          // Use the compressed file to upload the images to your server.
          setCompressedFile(compressedResult);
        },
      });
    } else {
      refAvatar.current.value = null;
    }
  };

  const onChangeAvatar = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file?.name);
    try {
      commonApis.preUploadFile(formData).then(async (response) => {
        const payloadUpdateProfile = {
          avatar: response,
          id: info?.id,
          fullName: info?.userInformation.fullName,
        };

        AuthApis.updateProfileUser(payloadUpdateProfile)
          .then(() => AuthApis.getProfile())
          .then((res) => {
            successHelper(t("update_avatar_success"));
            dispatch(setProfileAuth(res));
          })
          .catch((err) => {
            errorHelper(err);
          })
          .finally(() => {
            refAvatar.current.value = null;
            setIsUpdateAvatar(false);
          });
      });
    } catch (error) {
      refAvatar.current.value = null;
      setIsUpdateAvatar(false);
    }
  };

  const onGetAvatar = () => {
    let avatar = "";

    avatar = info?.userInformation?.avatar;

    if (avatar) {
      return avatar;
    }
    return "avatar.jpg";
  };

  return (
    <div className="navbar-user">
      <div className="box-avatar">
        <div className="avatar-action">
          <div className="position-relative avatar-action__img">
            <img className="img-avatar rounded-circle" src={onGetAvatar()} />
            <button
              disabled={isUpdateAvatar}
              onClick={() => refAvatar.current.click()}
              className="button-camera"
            >
              {isUpdateAvatar ? (
                <div
                  role="status"
                  className="spinner-border spinner-border-sm"
                />
              ) : (
                <i className="bi bi-camera-fill fs-5"></i>
              )}
              <input
                ref={refAvatar}
                type="file"
                accept="image/*"
                onChange={beforeChangeAvatar}
                style={{ display: "none" }}
              />
            </button>
          </div>

          <div className="avatar-action__text">
            <p className="avatar-action__text__name">
              {info?.userInformation?.fullName}
            </p>

            <h2 className="avatar-action__text__level">{level}</h2>
            {/* <div>
              <Badge bg="success">{commissionAutomation}</Badge>{" "}
            </div> */}
          </div>
        </div>
      </div>

      <ul className="nav-sidebar">
        <li>
          <NavLink to={"/profile"}>
            <span>{t("profile")}</span>
          </NavLink>
        </li>

        <li>
          <NavLink to={"/my-order"}>
            <span>{t("my_order")}</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={"/my-bonus"}>
            <span>Lịch sử thưởng</span>
          </NavLink>
        </li>
        <li className="d-none">
          <NavLink to={"/promotions"}>
            <i className="bi bi-lightning-charge"></i>
            <span>{t("promotion")}</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavbarUser;
