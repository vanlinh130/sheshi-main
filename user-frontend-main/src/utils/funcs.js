import accountApis from "@/apis/accountApis";
import levelConditionsApis from "@/apis/levelConditionsApis";

export const formatNumber = (value) => String(value).replace(/[^0-9]/g, "");

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
        if (totalPriceOfUser?.data < conditions.value || totalPriceOfUser < conditions.value) {
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
    accountApis.setLevelUser({
      id: user.id,
      level: newLevel,
    });
  }
};
