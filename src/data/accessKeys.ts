// 访问密钥列表 —— 不要在这里手写明文密钥，用 scripts/add-key.mjs 生成并自动追加到这个文件。
// label 只是给你自己看的备注（比如买家昵称/订单号），不参与校验。
export type AccessKeyEntry = { label: string; salt: string; hash: string }

export const accessKeys: AccessKeyEntry[] = [
  {
    "label": "测试账号",
    "salt": "e08047c7fb9cd71bcba7a8c1acdd57f1",
    "hash": "97b01062e08f043977a534047a427a2a3ec2513094e9377a7d585a0833cae14f"
  }
]
