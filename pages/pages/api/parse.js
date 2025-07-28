// pages/api/parse.js
import { EmbedBuilder } from "discord.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { code } = req.body;
  try {
    const { VM } = await import('vm2');
    const vm = new VM({
      sandbox: {
        EmbedBuilder,
        console,
        interaction: {
          user: {
            id: "123456789012345678",
            tag: "TestUser#1234"
          }
        },
        config: {
          hexMain: 0x5865f2,
          hexLog: 0x2b2d31
        },
        userAnswer: "Niebieski",
        questionIndex: 0,
        verificationQuestions: [
          { question: "Jaki jest kolor nieba?" }
        ]
      }
    });

    const result = vm.run(`(() => {
      ${code}
      return embed.toJSON();
    })()`);

    res.status(200).json({ embed: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
