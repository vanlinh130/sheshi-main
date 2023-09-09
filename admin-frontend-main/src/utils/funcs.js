import levelConditionsApis from "@/apis/levelConditionsApis";
import userApis from "@/apis/userApis";

export const formatNumber = (value) => String(value).replace(/[^0-9]/g, "");

export function formatDecimalNumber(value, maxlength = 7) {
  const splitValue = value.toString().split(".");

  const newNumber = [+splitValue[0], splitValue[1]]
    .join(".")
    .slice(0, maxlength);

  if (splitValue.length === 1) {
    return +splitValue[0].slice(0, maxlength);
  }
  return newNumber;
}

export function numberDecimalWithCommas(n) {
  var parts = n.toString().split(".");
  const numberPart = parts[0];
  const decimalPart = parts[1];
  const thousands = /\B(?=(\d{3})+(?!\d))/g;
  return (
    numberPart.replace(thousands, ",") + (decimalPart ? "." + decimalPart : "")
  );
}

export function convertToSlug(str) {
  // Chuyển hết sang chữ thường
  str = str.toLowerCase();

  // xóa dấu
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
  str = str.replace(/(đ)/g, "d");

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, "");

  // Xóa khoảng trắng thay bằng ký tự -
  str = str.replace(/(\s+)/g, "-");

  // xóa phần dự - ở đầu
  str = str.replace(/^-+/g, "");

  // xóa phần dư - ở cuối
  str = str.replace(/-+$/g, "");

  // return
  return str;
}

export const checkConditionLevelUp = async (
  user,
) => {
  let newLevel;
  const listLevel = [];
  const now = new Date();
  const conditionsLevel = await levelConditionsApis.getListLevelConditions();
  conditionsLevel.map((e) => {
    if (
      e.idLevel > user.level &&
      !listLevel.find((level) => level === e.idLevel)
    ) {
      listLevel.push(e.idLevel);
    }
  });
  listLevel.sort((a, b) => a - b);
  for (const level of listLevel) {
    const conditionsWithLevel = conditionsLevel.filter((e) => e.idLevel === level);
    let decidedUpLevel = true;
    for (const conditions of conditionsWithLevel) {
      decidedUpLevel = true;
      if (conditions.type === 1) {
        const startTime = new Date(
          now.getFullYear(),
          now.getMonth() + 1 - conditions.amountMonth,
          1
        );
        const endTime = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const totalPriceOfUser = await levelConditionsApis.totalPriceOfUser({
          userId: user.id,
          startTime,
          endTime,
        });
        if (totalPriceOfUser < conditions.value) {
          decidedUpLevel = false;
          break;
        }
      }
      if (conditions.type === 2) {
        const totalReferrerOfUser =
          await levelConditionsApis.totalReferrerWithLevel({
            userId: user.id,
            level: conditions.unit,
          });
        
          if (totalReferrerOfUser?.data < conditions.value || totalReferrerOfUser < conditions.value) {
            decidedUpLevel = false;
            break;
          }
      }
      if (conditions.type === 3) {
        if (conditions.value > user.level) {
          decidedUpLevel = false;
          break;
        }
      }
    }
    if (decidedUpLevel) {
      newLevel = level;
    }
  }
  if (newLevel) {
    userApis.setLevelUser({
      id: user.id,
      level: newLevel,
    });
  }
};
