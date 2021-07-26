const {
  getStakedSkills,
  getStakedRewardsSkills,
  getStakedTimeLeft,
  getTotalSkillOwnedBy,
  getAccountCharacters,
  getCharacterExp,
  getCharacterStamina,
} = require("./web3");

const { DateTime } = require("luxon");
const { weiToSkill } = require("./utils");

//selo
const addresses = [
  "0x1982845956B2d851B900632910a7e9C156AC5005",
  "0xB7C103F7bD5Da079cE55f275d4144B154A347C87",
  "0x66bA7e65E9301e2D995BA7f69b54d018d37bFe39",
  "0x8Bb989d8561f26Fe3D445C0ed9cbB66A930C0237",
  "0xC98bAA0Da17ad607Feb3868a32660b7E300ADeD2",
];

// zack
// const addresses = [
//   "0x72cB47c118DC41754B37C1B36Dc0d1C31A7A224F",
//   "0x0c5DFB886410F830B9E383b1a5477f772f45A4C7",
//   "0x4ab8a0307FC4b08EA642b3dbdABCE27Bb46F6394",
//   "0xFc1D7eFDf8e36c5Ba85dC81359f10B978Ed59C70",
// ]

// bubu

// const addresses = [
//   "0x1b789290472D007a4dBC17966CBC7a8F9b4D665F",
//   "0xf58Fa88d19C097DaB413647519499B8C46D687f9",
//   "0xa0012B513F4cf41ca5E3E97f62a002f8280e3b9D",
//   "0xFb30ec7c7961D37aE1e792E28bADc13cc7225c59"
// ]

const toFrenchDateTime = (d) =>
  DateTime.fromJSDate(d)
    .setLocale("fr")
    .toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);

(async () => {
  const getPrintableChar = (char) => {
    return `[${char.id}] -- STAM ${char.stamina}/200 full at ${toFrenchDateTime(
      char.staminaFullAt
    )} -- Exp ${char.exp}`;
  };

  // in game 5.1248
  // balance 0.2486
  // staked 1.83

  let totalSkills = 0;
  const results = await Promise.all(
    addresses.map(async (wallet) => {
      const skill = weiToSkill(await getTotalSkillOwnedBy(wallet));
      const staked = weiToSkill(await getStakedSkills(wallet));
      const stakedRewards = weiToSkill(await getStakedRewardsSkills(wallet));

      const stakeAvailableInSeconds = parseFloat(await getStakedTimeLeft(wallet));

      let stakeAvailableAt = new Date();
      debugger;
      stakeAvailableAt.setSeconds(
        stakeAvailableAt.getSeconds() + stakeAvailableInSeconds
      );

      const charIds = await getAccountCharacters(wallet);
      const chars = await Promise.all(
        charIds.map(async (id) => {
          const stamina = await getCharacterStamina(id);
          const exp = await getCharacterExp(id);
          let staminaFullAt = new Date();
          staminaFullAt.setMinutes(
            staminaFullAt.getMinutes() + (200 - stamina) * 5
          );

          return { id, stamina, exp, staminaFullAt };
        })
      );

      const total = skill + staked + stakedRewards;
      totalSkills += total;

      return {
        address: wallet,
        total: `${total} (ALL ${skill} + STK ${staked + stakedRewards})`,
        stakeAvailableAt: toFrenchDateTime(stakeAvailableAt),
        chars: chars.map((x) => getPrintableChar(x)),
      };
    })
  );

  console.log(results);
  console.log("-------------------------------------------");
  console.log(`¯\\_(*-*)_/¯ ${totalSkills} ¯\\_(*-*)_/¯`);
  console.log("-------------------------------------------");
})();
