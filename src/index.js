const {
  getTotalSkillOwnedBy,
  getStakedBalance,
  getStakedRewards,
  getAccountCharacters,
  getCharacterStamina,
} = require("./web3");

const { weiToSkill } = require("./utils");

const addresses = [
  "0x1982845956B2d851B900632910a7e9C156AC5005",
  "0xB7C103F7bD5Da079cE55f275d4144B154A347C87",
  "0x66bA7e65E9301e2D995BA7f69b54d018d37bFe39",
  "0x8Bb989d8561f26Fe3D445C0ed9cbB66A930C0237",
  "0xC98bAA0Da17ad607Feb3868a32660b7E300ADeD2",
];
(async () => {
  let sum = 0;

  const results = await Promise.all(
    addresses.map(async (x) => {
      const skill = weiToSkill(await getTotalSkillOwnedBy(x));
      const staked = weiToSkill(await getStakedBalance(x));
      const stakeRewards = weiToSkill(await getStakedRewards(x));
      sum += skill + staked + stakeRewards;
      const charIds = await getAccountCharacters(x);
      const chars = await Promise.all(
        charIds.map(async (x) => {
          return await getCharacterStamina(x);
        })
      );
      return {
        address: x,
        skill,
        staked,
        stakeRewards,
        chars,
      };
    })
  );

  console.log(results);
  console.log(sum);
})();
