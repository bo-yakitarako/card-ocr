以下のカード画像を読み取り、情報を構造化JSONとして出力してください。

抽出するフィールド:

- name: カード名
- hp: HP（数値）
- types: タイプ（属性シンボルの配列）
- attacks: ワザの配列（name / cost / damage / effect）
- weakness: 弱点
- resistance: 抵抗
- retreatCost: にげるコスト（シンボル数）
- regulationMark: レギュレーションマーク
- flavor: フレーバーテキスト
- cardNumber: カード番号
- set: 収録セット
- illustrator: イラストレーター名

読み取れないフィールドは null または空配列にしてください。推測で補完しないでください。
