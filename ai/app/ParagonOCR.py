import math
import torch

class CNNEncoder(torch.nn.Module):
    def __init__(self):
        super(CNNEncoder, self).__init__()

        act = torch.nn.LeakyReLU(negative_slope=0.2, inplace=True)

        self.cnn = torch.nn.Sequential(
            torch.nn.Conv2d(in_channels=1, out_channels=64, kernel_size=3, stride=1, padding=1),
            act,
            torch.nn.MaxPool2d(kernel_size=2, stride=2),
            # (B, 64, H/2, W/2)

            torch.nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, stride=1, padding=1),
            act,
            torch.nn.MaxPool2d(kernel_size=2, stride=2),
            # (B, 128, H/4, W/4)

            torch.nn.Conv2d(in_channels=128, out_channels=256, kernel_size=3, stride=1, padding=1),
            act,
            torch.nn.Conv2d(in_channels=256, out_channels=256, kernel_size=3, stride=1, padding=1),
            act,
            # (B, 256, H/4, W/4)

            torch.nn.Conv2d(256, 256, kernel_size=3, stride=(2, 1), padding=1),
            act,
            # (B, 256, H/8, W/4)

            torch.nn.Conv2d(in_channels=256, out_channels=512, kernel_size=3, stride=1, padding=1),
            torch.nn.InstanceNorm2d(num_features=512),
            act,
            # (B, 512, H/8, W/4)

            torch.nn.Conv2d(in_channels=512, out_channels=512, kernel_size=3, stride=1, padding=1),
            torch.nn.InstanceNorm2d(num_features=512),
            act,

            torch.nn.Conv2d(512, 512, kernel_size=3, stride=(2, 1), padding=1),
            act,
            # (B, 512, H/16, W/4)

            torch.nn.Conv2d(512, 512, kernel_size=3, stride=(1, 2), padding=1),
            act,
            # (B, 512, H/16, W/8) // might help CTC

            torch.nn.AdaptiveAvgPool2d(output_size=(1, None)),
            # (B, 512, 1, W/4)
        )

    def forward(self, x):
        x = self.cnn(x)    # (B, 512, 1, W/4)
        x = x.squeeze(2)   # (B, 512, W/4)
        x = x.permute(0, 2, 1) # (B, W/4, 512) = (B, T, 512) time-major

        return x

class SequenceProjection(torch.nn.Module):
    def __init__(self, in_features=512, embed_dim=256, dropout=0.1):
        super(SequenceProjection, self).__init__()

        self.proj = torch.nn.Linear(in_features=in_features, out_features=embed_dim, bias=True)
        self.norm = torch.nn.LayerNorm(embed_dim)
        self.dropout = torch.nn.Dropout(dropout)

    def forward(self, x):
        x = self.proj(x) # (B, T, D)
        x = self.norm(x)
        x = self.dropout(x)

        return x

class PositionalEncoding(torch.nn.Module):
    def __init__(self, d_model, max_len=5000):
        super().__init__()

        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len).unsqueeze(1)

        div_term = torch.exp(torch.arange(0, d_model, 2) * (-math.log(10000.0) / d_model))

        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)

        self.register_buffer("pe", pe.unsqueeze(0))  # shape: (1, max_len, d_model)

    def forward(self, x):
        # x: (B, T, D)
        T = x.size(1)
        return x + self.pe[:, :T]


class TransformerEncoder(torch.nn.Module):
    def __init__(self, embed_dim=384, nhead=6, dim_feedforward=1024, dropout=0.1, num_layers=8):
        super(TransformerEncoder, self).__init__()

        self.pos_encoding = PositionalEncoding(embed_dim)

        encoder_layer = torch.nn.TransformerEncoderLayer(
            d_model=embed_dim,
            nhead=nhead,
            dim_feedforward=dim_feedforward,
            dropout=dropout,
            activation=torch.nn.functional.relu,
            layer_norm_eps=1e-5,
            batch_first=True, # (B, T, D)
            norm_first=True,
            bias=True
        )

        self.encoder = torch.nn.TransformerEncoder(
            encoder_layer=encoder_layer,
            num_layers=num_layers,
            norm=None,
            enable_nested_tensor=False,
            mask_check=True
        )

    def forward(self, x):
        x = self.pos_encoding(x) # (B, T, D)
        x = self.encoder(x) # (B, T, D)

        return x

class CTCHead(torch.nn.Module):
    def __init__(self, num_classes, embed_dim=256):
        super(CTCHead, self).__init__()

        self.fc = torch.nn.Linear(embed_dim, num_classes)

    def forward(self, x):
        x = self.fc(x) # (B, T, N) logits

        return x

class ParagonOCR(torch.nn.Module):
    def __init__(self, num_classes):
        super(ParagonOCR, self).__init__()

        self.cnn_encoder = CNNEncoder()
        self.sequence_projection = SequenceProjection(
            in_features=512,
            embed_dim=384,
        )
        self.transformer_encoder = TransformerEncoder(
            embed_dim=384,
            nhead=6,
            dim_feedforward=1536,
            num_layers=8,
        )
        self.ctc_head = CTCHead(num_classes=num_classes, embed_dim=384)

    def forward(self, x):
        # (B, 1, H, W)

        x = self.cnn_encoder(x)         # (B, T, C)
        x = self.sequence_projection(x) # (B, T, D)
        x = self.transformer_encoder(x) # (B, T, D)
        x = self.ctc_head(x)            # (B, T, N)

        return x # logits
