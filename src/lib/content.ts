export type FillCard = {
  type: "fill";
  id: string;
  prompt: string;
  accept: string[];
  canonical: string;
  explain: string;
  locked?: string;
};

export type ChoiceCard = {
  type: "choice";
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
  locked?: string;
};

export type OrderCard = {
  type: "order";
  id: string;
  prompt: string;
  items: { id: string; text: string }[];
  answer: string[];
  explain: string;
  locked?: string;
};

export type CodeCard = {
  type: "code";
  id: string;
  prompt: string;
  template: string;
  blanks: { id: string; label: string; accept: string[] }[];
  explain: string;
  locked: string;
};

export type Card = FillCard | ChoiceCard | OrderCard | CodeCard;

export const words: FillCard[] = [
  {
    type: "fill",
    id: "w-under",
    prompt: "模型太简单，训练误差大，新数据的误差也大。报告里用的英文词是？",
    accept: ["underfitting", "underfit", "欠拟合"],
    canonical: "underfitting",
    explain:
      "欠拟合是容量不够。H = 0 或 1 时曲线几乎弯不动，训练点本身就贴不上，新的 x 也不会好。写报告时要说出它在拟合一条过直的线。",
  },
  {
    type: "fill",
    id: "w-over",
    prompt: "训练误差可以很小，但曲线把噪声也记下来了，新的 x 预测不好。这个词是？",
    accept: ["overfitting", "overfit", "过拟合"],
    canonical: "overfitting",
    explain:
      "过拟合是模型够灵活，又练得够久，于是跟着训练点里的噪声走。只写这个单词不够，要写清它贴的是噪声，所以新数据上那些弯没有道理还在。",
  },
  {
    type: "fill",
    id: "w-val",
    prompt: "用来比较不同的 H、决定停在哪一轮、挑选 λ，但不拿去训练的那一份数据叫？",
    accept: ["validation", "validation set", "val", "验证集"],
    canonical: "validation set",
    explain:
      "验证集可以看很多次，因为你在用它做选择。被你挑中的那个最小验证误差会偏乐观：它可能只是在这 30 个点上走运。",
  },
  {
    type: "fill",
    id: "w-test",
    prompt: "所有选择做完之后，只评估一次、用来报告成绩的那一份叫？",
    accept: ["test", "test set", "测试集"],
    canonical: "test set",
    explain:
      "测试集没有参加任何决定。看过测试误差再回去改 λ 或 H，它就变成了第二个验证集，报告出去的数会偏小。",
  },
  {
    type: "fill",
    id: "w-floor",
    prompt: "就算学到了真实函数，新数据的均方误差平均也下不去的那一层叫什么？第 6 题之前不要去文件里查它的数值。",
    accept: ["noise floor", "irreducible error", "噪声下限", "不可约误差", "σ^2", "sigma^2"],
    canonical: "noise floor",
    explain:
      "新的 y 里有一份从 x 预测不出来的噪声。这份误差去不掉。验证误差平均不会低于它，所以你可以从验证曲线的低处粗估它，而不是打开 make_data.py。",
  },
  {
    type: "fill",
    id: "w-cap",
    prompt: "这份作业里只改隐层宽度 H。H 控制的是模型的？",
    accept: ["capacity", "容量"],
    canonical: "capacity",
    explain:
      "容量是模型能表示多复杂的函数。H = 0 是直线；H 越大，sigmoid 单元越多，曲线越能扭。",
  },
  {
    type: "fill",
    id: "w-early",
    prompt: "把权重留在验证误差最低的那一轮，而不是留在最后一轮。这叫？",
    accept: ["early stopping", "早停"],
    canonical: "early stopping",
    explain:
      "大网络先学到数据的大形状，后才去贴噪声。早停是在第二阶段开始之前停下来。它和选一个更小的 H 是同一类办法：少给模型一点自由。fit.py 不会自动保存最好的权重，你要查出那一轮，再按那个轮数重新训练。",
  },
  {
    type: "fill",
    id: "w-wd",
    prompt: "在损失上加 (λ/2)‖θ‖²，让大权重受罚、曲线变平滑。这个 λ 在 fit.train 里的参数名意思是？",
    accept: ["weight decay", "weightdecay", "权值衰减", "权重衰减"],
    canonical: "weight decay",
    explain:
      "sigmoid(wx + b) 的斜率正比于 w。弯得很厉害的曲线需要大权重。罚权重大小，就会把曲线往平滑推。λ 很大时惩罚过头，模型又会欠拟合。",
  },
];

export const rules: ChoiceCard[] = [
  {
    type: "choice",
    id: "r-train",
    prompt: "第 1 题之后，fit.train 可以吃哪些点？",
    options: [
      "全部 120 个点，误差更稳",
      "只有训练集 (xtr, ytr)。验证集只用来记录或事后计算",
      "训练集加验证集，测试集留到最后",
      "哪一份误差低就用哪一份训练",
    ],
    answer: 1,
    explain:
      "从第 2 题起，训练只用 (xtr, ytr)。验证集可以传给 xval、yval，让 history['val'] 记下误差，那个数不参与反向传播。用测试集训练或用它来挑模型，都会直接丢分。",
  },
  {
    type: "choice",
    id: "r-split",
    prompt: "第 2 题之后，划分用哪一组数字？",
    options: [
      "fit.py 文件头注释里的 n_train=60, n_val=30",
      "n_train=30, n_val=30，剩下 60 个是测试集，而且后面一直用这一次划分",
      "每做一题重新随机分一次",
      "不要验证集，120 个点里 90 个训练、30 个测试",
    ],
    answer: 1,
    explain:
      "正文写了 exactly 这一次：30 个训练、30 个验证、60 个测试。文件头注释里的 60 只是 split 函数的用法示例。划分的种子默认是 0，不要另改。",
  },
  {
    type: "choice",
    id: "r-h",
    prompt: "只看训练损失，能不能选出最好的 H？",
    options: [
      "能。训练损失最小的网络就是预测新数据最好的",
      "不能。H 变大时训练损失只会更小或持平，它量的是训练点，不是没见过的点",
      "能，只要把 H = 100 再训练一次核对",
    ],
    answer: 1,
    explain:
      "大网络可以把多出来的权重设成 0，退回小网络能表示的函数，所以训练损失不会因为 H 变大而变差。你要的是新数据上的误差，那只能在留出的验证集上看。",
  },
  {
    type: "choice",
    id: "r-test",
    prompt: "看过测试损失之后，又试了几个 λ，把测试损失最小的那个写进报告。问题在哪？",
    options: [
      "没有问题，测试集就是用来挑最终模型的",
      "测试集参加了选择。被挑中的那个数偏小，不再是诚实的新数据误差",
      "问题只是要多跑几分钟",
    ],
    answer: 1,
    explain:
      "选模型和报告成绩必须分开。验证集负责挑，测试集只负责最后说一次。同一份留出数据两边都干，被你挑中的那个误差会偏乐观。",
  },
  {
    type: "choice",
    id: "r-peek",
    prompt: "make_data.py 里有真实函数和噪声大小。什么时候可以打开？",
    options: [
      "写第 1 题之前打开，方便对图",
      "第 2 题估完噪声下限就打开，用来核对",
      "第 6 题。题目说到 fresh points 时才允许看",
    ],
    answer: 2,
    explain:
      "第 2 题要你从验证曲线自己估噪声下限。提前看了，这个估计就没有意义。第 6 题会给你一万个新点，用来检查验证误差和测试误差各自离真误差有多远。",
  },
  {
    type: "choice",
    id: "r-time",
    prompt: "某一轮训练要跑好几分钟。说明什么？",
    options: [
      "正常，20000 轮就该这么慢",
      "必须用 GPU",
      "写错了。题目说笔记本 CPU 上大约二十秒以内",
    ],
    answer: 2,
    explain:
      "数据只有几十到一百多个点，而且是整批训练，没有 minibatch。跑到分钟级，先检查是不是循环套错、epochs 多写了几个零，或者把一万个 fresh points 拿去训练了。",
  },
  {
    type: "choice",
    id: "r-marks",
    prompt: "前 7 题的分数主要在哪里？",
    options: [
      "图和代码风格",
      "大约三分之一在实验做对、图画清楚，大约三分之二在解释",
      "第 8 题占了 80 分",
    ],
    answer: 1,
    explain:
      "图对了但只描述、不解释，分很少。用了 underfitting 或 overfitting 却不说模型拟合到了什么，也会丢分。每小问大多两到五句。前 7 题的 PDF 最多 6 页，第 8 题再加最多 3 页。",
  },
  {
    type: "choice",
    id: "r-seed",
    prompt: "第 2 题让你用 seed=1 再跑一次。这一下改的是什么？",
    options: [
      "数据怎么划分",
      "只有网络的初始权重。最好的 H 如果跟着晃，说明 30 个验证点钉不很死",
      "噪声的大小",
    ],
    answer: 1,
    explain:
      "fit.split 的种子和 fit.train 的种子是两件事。作业要求划分固定，只换训练的初始权重。报告里要老实说：选择有多清楚，换一次初始权重之后变了多少。",
  },
];

export const torchSteps: Card[] = [
  {
    type: "choice",
    id: "t-shape",
    prompt: "data.csv 里的 x 是 120 个数，形状 (120,)。nn.Linear 要的输入是哪一种？",
    options: [
      "(120,)，一维就行",
      "(120, 1)，每一行一个样本，每个样本 1 个特征",
      "(1, 120)，一个样本里有 120 个特征",
    ],
    answer: 1,
    locked: "# x, y 从 (n,) 变成 (n, 1)，一行一个样本",
    explain:
      "第 0 维是样本数，第 1 维是特征数。这门课的仿射层 a = xW + b 也是这个约定：x 的最后一维要和权重的输入维对齐。这里每个点只有一个 x，所以是 1 列。",
  },
  {
    type: "code",
    id: "t-reshape",
    prompt: "自己写出这个变形。-1 表示“这一维有多少行，由数据自己决定”。",
    template: "def _t(a):\n    return torch.as_tensor(np.asarray(a)).reshape({{shape}})",
    blanks: [{ id: "shape", label: "reshape( )", accept: ["-1, 1", "-1,1", "(-1, 1)", "(-1,1)"] }],
    locked: "def _t(a):\n    return torch.as_tensor(np.asarray(a)).reshape(-1, 1)",
    explain:
      "reshape(-1, 1) 把任意长度的一维数组收成一列。fit.py 里加载、训练、算误差、画图，都先过这个函数。",
  },
  {
    type: "code",
    id: "t-line",
    prompt: "H = 0 时没有隐层，就是直线 f(x) = wx + b。Linear 的两个数分别是输入维和输出维。",
    template: "def make_net(hidden):\n    if hidden == 0:\n        return nn.Linear({{din}}, {{dout}})",
    blanks: [
      { id: "din", label: "输入维", accept: ["1"] },
      { id: "dout", label: "输出维", accept: ["1"] },
    ],
    locked: "if hidden == 0:\n    return nn.Linear(1, 1)   # 两个参数: w 和 b",
    explain:
      "nn.Linear(1, 1) 有一个权重和一个偏置，共 2 个参数。有隐层时参数个数才是 3H + 1。H = 0 不要套 3×0+1。图的标题会把参数个数印出来。",
  },
  {
    type: "code",
    id: "t-seq",
    prompt: "有隐层时：先从 1 维投到 H 维，过 sigmoid，再从 H 维投回 1 维。把四条空按这个顺序填。",
    template:
      "return nn.Sequential(\n    nn.Linear({{din}}, {{h}}),\n    nn.{{act}}(),\n    nn.Linear({{h2}}, {{dout}}),\n)",
    blanks: [
      { id: "din", label: "第一层输入", accept: ["1"] },
      { id: "h", label: "第一层输出", accept: ["hidden", "h"] },
      { id: "act", label: "激活", accept: ["sigmoid", "nn.sigmoid"] },
      { id: "h2", label: "第二层输入", accept: ["hidden", "h"] },
      { id: "dout", label: "第二层输出", accept: ["1"] },
    ],
    locked:
      "return nn.Sequential(\n    nn.Linear(1, hidden),\n    nn.Sigmoid(),\n    nn.Linear(hidden, 1),\n)",
    explain:
      "这就是作业里的式子：每个隐单元先算 w x + b，再过 σ(a) = 1/(1+e^{-a})，最后加权求和加上输出偏置。每个隐单元贡献 3 个参数，输出偏置再加 1，所以是 3H+1。",
  },
  {
    type: "choice",
    id: "t-count",
    prompt: "H = 2 时，这个网络有多少个可训练参数？用 3H+1 算。",
    options: ["4", "6", "7", "2"],
    answer: 2,
    locked: "# H = 2 时参数是 3*2+1 = 7",
    explain:
      "两个隐单元各有：输入权重、输入偏置、输出权重。再加上一个输出偏置：6+1=7。fit.n_params(net) 就是把 net.parameters() 里的元素个数加起来，你可以用它核对。",
  },
  {
    type: "choice",
    id: "t-seed",
    prompt: "torch.manual_seed(seed) 要写在哪一行之前，第 2 题换 seed=1 才会真的换初始权重？",
    options: [
      "写在 make_net(hidden) 之前。Linear 一创建就把权重随机好了",
      "写在训练循环结束之后",
      "写在哪里都一样，seed 会回头改已经创建的网络",
    ],
    answer: 0,
    locked: "torch.manual_seed(seed)\nnet = make_net(hidden)",
    explain:
      "权重的随机数发生在 nn.Linear(...) 被调用的那一刻。种子写晚了，网络已经生出来，再设种子只影响后面的随机数。fit.train 里就是先设种子，再 make_net。",
  },
  {
    type: "code",
    id: "t-adam",
    prompt: "把优化器接上。它要拿到网络的可训练参数。weight_decay 就是 λ，交给优化器，不用自己把惩罚项加进 loss。",
    template: "opt = torch.optim.{{name}}(net.{{params}}(), lr=lr, weight_decay=weight_decay)",
    blanks: [
      { id: "name", label: "优化器", accept: ["adam"] },
      { id: "params", label: "参数从哪来", accept: ["parameters", "parameters()"] },
    ],
    locked: "opt = torch.optim.Adam(net.parameters(), lr=lr, weight_decay=weight_decay)",
    explain:
      "parameters() 把每一层的权重和偏置交出去。Adam 对每个参数分开记梯度的滑动平均和梯度平方的滑动平均，步长按这个参数自己的梯度大小缩放。默认学习率 0.01。",
  },
  {
    type: "code",
    id: "t-loss",
    prompt: "训练损失是均方误差。对全部训练点算 (预测 − y) 的平方，再平均。这个平均就是作业里的 L(θ)。",
    template: "loss = ((net(X) - Y) ** {{power}}).{{reduce}}()",
    blanks: [
      { id: "power", label: "几次方", accept: ["2"] },
      { id: "reduce", label: "怎么汇总", accept: ["mean"] },
    ],
    locked: "loss = ((net(X) - Y) ** 2).mean()",
    explain:
      "X、Y 都是 (n, 1)。net(X) 也是 (n, 1)。平方后对所有元素取平均，得到一个标量。反向传播从这个标量出发。这里的 X、Y 只能是训练集。",
  },
  {
    type: "order",
    id: "t-order",
    prompt: "循环体里这四行有固定顺序。按一次更新真正发生的顺序排好。",
    items: [
      { id: "b", text: "loss.backward()" },
      { id: "z", text: "opt.zero_grad()" },
      { id: "s", text: "opt.step()" },
      { id: "l", text: "loss = ((net(X) - Y) ** 2).mean()" },
    ],
    answer: ["z", "l", "b", "s"],
    locked: "opt.zero_grad()\nloss = ((net(X) - Y) ** 2).mean()\nloss.backward()\nopt.step()",
    explain:
      "先清掉上一步残留的梯度，再做前向得到损失，backward 把每个参数的梯度算出来，step 才按梯度改权重。backward 在 step 前面，否则这一步还没有梯度可用。",
  },
  {
    type: "choice",
    id: "t-zero",
    prompt: "如果循环里忘了 opt.zero_grad()，会发生什么？",
    options: [
      "PyTorch 会自动清零，结果一样",
      "旧梯度还留在参数上，新梯度往上加，更新方向越来越偏",
      "loss.backward() 会直接报错，训练停住",
    ],
    answer: 1,
    locked: "# 每一步都要 zero_grad，梯度不会自己清掉",
    explain:
      "backward 默认把新梯度加到已经存在的梯度上。不清零，第 2 步用的就不是“当前损失的梯度”。这份小数据上症状常常是损失下降得很怪，或者怎么也降不干净。",
  },
  {
    type: "code",
    id: "t-mse",
    prompt: "量一份数据上的误差时，不要建计算图。再把那个只有一个数的张量变成 Python 浮点数，才能放进列表。",
    template: "def mse(net, x, y):\n    with torch.{{guard}}():\n        return ((net(_t(x)) - _t(y)) ** 2).mean().{{out}}()",
    blanks: [
      { id: "guard", label: "with torch.?", accept: ["no_grad", "nograd"] },
      { id: "out", label: "张量变数字", accept: ["item"] },
    ],
    locked:
      "def mse(net, x, y):\n    with torch.no_grad():\n        return ((net(_t(x)) - _t(y)) ** 2).mean().item()",
    explain:
      "no_grad 表示这次前向只是读结果，不给 backward 留图。item() 取出一个普通浮点数。验证误差用这个函数记下来，它不参与 opt.step()。",
  },
  {
    type: "code",
    id: "t-val",
    prompt: "验证集只记录，不进训练损失。history['val'] 的每一项应该调用你刚写的哪个函数？",
    template: "if xval is not None:\n    history[\"val\"].append({{fn}}(net, xval, yval))",
    blanks: [{ id: "fn", label: "函数名", accept: ["mse", "fit.mse"] }],
    locked: "history[\"val\"].append(mse(net, xval, yval))",
    explain:
      "训练损失仍然只对训练集的 X、Y 做 backward。验证集出现在 mse 里，包在 no_grad 中。把 yval 写进 loss = ((net(X) - Y) ** 2).mean() 就等于拿验证集训练，后面再用它选 H 就不诚实了。",
  },
  {
    type: "choice",
    id: "t-leak",
    prompt: "下面哪一行会把验证集泄漏进训练？",
    options: [
      "history['val'].append(mse(net, xval, yval))",
      "loss = ((net(X) - Y) ** 2).mean()，而这里的 X、Y 换成了验证集",
      "fit.mse(net, xte, yte) 在全部决定做完后调用一次",
    ],
    answer: 1,
    locked: "# 反向传播只用训练集。验证集只出现在 mse 的记录里",
    explain:
      "记录验证误差是允许的，最后在测试集上算一次也是允许的。泄漏指的是：选择模型用过的数据，又进了 loss.backward()。第 1 题例外，那一题本来就是用全部 120 个点。",
  },
  {
    type: "code",
    id: "t-predict",
    prompt: "画曲线时，网络输出要变回 numpy 的一维数组。同样不要建计算图。",
    template: "with torch.no_grad():\n    return net(_t(x)).{{to_np}}().{{flat}}()",
    blanks: [
      { id: "to_np", label: "变 numpy", accept: ["numpy"] },
      { id: "flat", label: "摊成一维", accept: ["ravel"] },
    ],
    locked: "with torch.no_grad():\n    return net(_t(x)).numpy().ravel()",
    explain:
      "predict 给的是一串 x（比如从 -2 到 2 的 400 个点），返回一串 y，方便 ax.plot。它不改权重。",
  },
  {
    type: "code",
    id: "t-loop",
    prompt: "把循环体一次写完。这是 fit.train 里每次更新都在做的五件事里，你要亲手填的五个空。",
    template:
      "for _ in range(epochs):\n    opt.{{z}}()\n    loss = ((net(X) - Y) ** {{p}}).{{m}}()\n    loss.{{b}}()\n    opt.{{s}}()\n    history[\"train\"].append(loss.item())",
    blanks: [
      { id: "z", label: "清梯度", accept: ["zero_grad"] },
      { id: "p", label: "几次方", accept: ["2"] },
      { id: "m", label: "汇总", accept: ["mean"] },
      { id: "b", label: "求梯度", accept: ["backward"] },
      { id: "s", label: "更新参数", accept: ["step"] },
    ],
    locked:
      "for _ in range(epochs):\n    opt.zero_grad()\n    loss = ((net(X) - Y) ** 2).mean()\n    loss.backward()\n    opt.step()\n    history[\"train\"].append(loss.item())",
    explain:
      "能默写这一段，后面改 epochs、换优化器、加验证记录，都是在这段外面动，而不是重写一份新的训练。前 7 题你调用 fit.train 即可，不必把文件改掉。",
  },
  {
    type: "choice",
    id: "t-sgd",
    prompt: "第 7 题比较 Adam 和普通梯度下降。PyTorch 里普通梯度下降写哪个名字？哪怕这次用的是全部数据、一步都没有随机抽样。",
    options: ["torch.optim.GD", "torch.optim.SGD", "torch.optim.AdamW", "loss.backward(sgd=True)"],
    answer: 1,
    locked: "opt = torch.optim.SGD(net.parameters(), lr=lr, weight_decay=weight_decay)",
    explain:
      "fit.train(..., optimiser=\"sgd\", lr=...) 里面就是这一行。名字叫 SGD，是因为这个类通常配 minibatch；这里批次等于全部训练点，更新本身不再随机。学习率不合适时，它要么几乎不动，要么发散。这是第 7 题要你在 0.01、0.1、0.3、1.0 上看见的事。",
  },
  {
    type: "code",
    id: "t-relu",
    prompt: "第 8 题如果问“换成 ReLU 以后，验证曲线还是不是先降后升”，Sequential 里只换一个词。先把它写对。实验仍然要你自己跑。",
    template: "nn.Sequential(nn.Linear(1, hidden), nn.{{act}}(), nn.Linear(hidden, 1))",
    blanks: [{ id: "act", label: "激活", accept: ["relu", "nn.relu"] }],
    locked: "nn.Sequential(nn.Linear(1, hidden), nn.ReLU(), nn.Linear(hidden, 1))",
    explain:
      "ReLU 在负半轴输出 0，正半轴是直线，拟合出来的曲线会是折线，和 sigmoid 的光滑弯不一样。权重衰减对 sigmoid 的“大权重 = 陡坡”那个解释，换了 ReLU 还成不成立，就是一个够格的第 8 题问题。前 7 题保持 Sigmoid，不要提前改 fit.py。",
  },
];

export type Chapter = {
  id: string;
  n: number;
  title: string;
  marks: string;
  why: string;
  steps: string[];
  code?: string;
  avoid: string;
  write: string;
  check: ChoiceCard;
};

export const chapters: Chapter[] = [
  {
    id: "ex1",
    n: 1,
    title: "先用全部数据，看见训练损失会骗人",
    marks: "10 分",
    why: "第 1 题故意用全部 120 个点。你要亲眼看到：H 越大训练误差越小，但 H = 20 那种贴着每个点走的曲线，并不该拿去预测新的 x。",
    steps: [
      "在 coursework 目录运行一次 python make_data.py，得到 data.csv。",
      "再运行 python exercise1.py。六个面板的标题里有参数个数和训练 MSE。",
      "终端那个 print 写在设纵坐标的循环里，可能只把最后一个 H 打印两次。以每个子图的标题为准。",
      "读 fit.py 从上到下。前 7 题不用改它。",
    ],
    avoid: "这一题还不要划分数据。也不要打开 make_data.py 看真实函数。",
    write: "H = 0 和 H = 1 要说出曲线太简单，训练点也贴不上。H = 20 要说出它为了靠近带噪声的点多拐了弯。再解释为什么 H 变大时训练损失不会变差：多出来的单元可以把权重变成 0。",
    check: {
      type: "choice",
      id: "p1",
      prompt: "哪一句写进报告能拿到解释分？",
      options: [
        "H = 20 过拟合了。",
        "H = 20 为了靠近训练点里的噪声，曲线多拐了弯。一个新的 x 上，这些弯没有理由还在。",
        "H = 20 的训练损失更小，所以预测新数据更好。",
      ],
      answer: 1,
      explain:
        "第二句说出了拟合到什么。第一句只有单词。第三句把训练损失当成了新数据上的误差，这正是整份作业要推翻的假设。",
    },
  },
  {
    id: "ex2",
    n: 2,
    title: "用验证集选容量",
    marks: "15 分",
    why: "这是整份作业的核心。训练损失会一路变好，验证损失会先降后升。你在低谷附近选 H，并老实说这个选择有多清楚。",
    steps: [
      "只用这一次划分，后面每题都用它。",
      "H 取 0, 1, 2, 3, 5, 10, 20, 50, 100，每个训练 20000 轮。",
      "记下最后一轮训练损失，以及 fit.mse(net, xva, yva)。",
      "H 用对数坐标。H = 0 可以画在 0.5，或只写在文字里。",
      "再用 seed=1 重跑，比较验证曲线和你选的 H 晃了多少。",
    ],
    code: `(xtr, ytr), (xva, yva), (xte, yte) = fit.split(x, y, n_train=30, n_val=30)

for H in [0, 1, 2, 3, 5, 10, 20, 50, 100]:
    net, history = fit.train(xtr, ytr, hidden=H, epochs=20000)
    train_mse = history["train"][-1]
    val_mse = fit.mse(net, xva, yva)`,
    avoid: "不要把 xva 放进 fit.train 的训练数据。xte 这一题还不要看。",
    write: "描述两条线的形状，并用欠拟合和过拟合解释验证线。选出的 H 要说明清不清楚。从验证线的低处粗估噪声下限，并说明验证误差平均为什么下不去到那一层以下。",
    check: {
      type: "choice",
      id: "p2",
      prompt: "跑完之后，你要对着自己的图核对的形状是哪一种？",
      options: [
        "训练损失和验证损失都随 H 降到 0",
        "训练损失整体下降；验证损失先降后升",
        "验证损失每一点都低于训练损失",
      ],
      answer: 1,
      explain:
        "先降，是模型终于够用，欠拟合减轻。后升，是模型开始记这 30 个训练点的噪声。低谷不必是一个孤零零的 H，报告里可以写你在哪一段里选，以及换 seed 之后这段动了没有。",
    },
  },
  {
    id: "ex3",
    n: 3,
    title: "练太久也会过拟合",
    marks: "10 分",
    why: "容量不是唯一的旋钮。H = 20 从随机的近乎平的函数开始，先学大形状，后学噪声。验证损失会告诉你它走到了哪一段。",
    steps: [
      "H = 20，20000 轮，把验证集传进去，这样 history['val'] 才有记录。",
      "训练损失和验证损失对轮数画双对数坐标。",
      "找到验证损失最小的下标 best = argmin(history['val'])。",
      "fit.py 不保存中间权重。再用 epochs=best+1 训练一次，得到早停曲线。下标从 0 开始，所以要加 1，那一轮才算练完。",
    ],
    code: `net, history = fit.train(
    xtr, ytr, hidden=20, epochs=20000, xval=xva, yval=yva
)
best = int(np.argmin(history["val"]))
net_early, _ = fit.train(xtr, ytr, hidden=20, epochs=best + 1)`,
    avoid: "早停用的仍是验证集。不要为了让曲线好看去看测试集。",
    write: "写出大致在哪一段验证损失最低，以及那里和最后一轮的两个损失。说明早停和更小的 H 的共同点：都是不让模型走到记噪声的那一步。再比较两条拟合曲线。",
    check: {
      type: "choice",
      id: "p3",
      prompt: "早停和选一个更小的 H，共同点是什么？",
      options: [
        "都是把学习率改小",
        "都是限制模型能追逐的细节，让它停在大形状上，少去拟合噪声",
        "都是把验证集放进损失一起训练",
      ],
      answer: 1,
      explain:
        "一个限制的是宽度，一个限制的是训练时间。两个都在控制容量真正用出去多少。最后一轮的曲线会更贴训练点，早停的曲线更平滑。",
    },
  },
  {
    id: "ex4",
    n: 4,
    title: "用权重衰减把弯拉平",
    marks: "10 分",
    why: "第三个旋钮改的是损失本身。罚大权重，sigmoid 就做不出很陡的弯，曲线被迫变平滑。",
    steps: [
      "H = 20，20000 轮。",
      "λ 取 0、1e-4、1e-3、1e-2、1e-1。",
      "表里写每个 λ 的训练损失和验证损失。",
      "画三条曲线：λ = 0、你选的 λ、λ = 0.1。",
    ],
    code: `for lam in [0, 1e-4, 1e-3, 1e-2, 1e-1]:
    net, history = fit.train(
        xtr, ytr, hidden=20, epochs=20000, weight_decay=lam
    )`,
    avoid: "选 λ 只看验证损失。这一题仍然不要打开测试集。",
    write: "两头要分开说：λ = 0 是 H = 20 练满 20000 轮，容易贴噪声；λ = 0.1 惩罚太重，曲线被拉平，变成欠拟合。再把你选的验证损失和第 2 题、第 3 题的最好验证损失比。",
    check: {
      type: "choice",
      id: "p4",
      prompt: "λ 很大时，曲线变平滑的原因是？",
      options: [
        "大学习率把所有点拉成一条直线",
        "陡弯需要大的 w，因为 sigmoid(wx+b) 的斜率正比于 w；罚 ‖θ‖² 就罚了这种弯",
        "权重衰减会把 H 自动改成 0",
      ],
      answer: 1,
      explain:
        "这是作业正文里的机制，写进 (a) 就用得上。λ 不是把网络变窄，而是让现有的这些权重不敢太大。",
    },
  },
  {
    id: "ex5",
    n: 5,
    title: "测试集只看一次",
    marks: "10 分",
    why: "你已经用验证集做了三次决定：H、停在哪一轮、λ。赢家的验证误差偏小。测试集是唯一没参与决定的数据。",
    steps: [
      "根据第 2 到 4 题定一个最终组合：H、λ、轮数。",
      "在训练集上训练这一个模型。",
      "fit.mse(net, xte, yte) 只调用这一次。",
      "报告训练、验证、测试三个损失。",
    ],
    code: `test_mse = fit.mse(net, xte, yte)  # 整个作业只这一次`,
    avoid: "看完测试损失再改 λ 或 H，然后报告改完的测试损失。这一步本身就是错的。",
    write: "说明平均而言为什么该预期测试损失大于验证损失。再说明：如果选模型和报告成绩共用一份留出数据，偏小的是哪一个数。",
    check: {
      type: "choice",
      id: "p5",
      prompt: "平均而言，为什么最终模型的测试损失往往会大于它的验证损失？",
      options: [
        "测试集有 60 个点，点多所以误差大",
        "你在多个候选里挑了验证损失最小的，它容易在这 30 个验证点上走运",
        "测试集没有被 shuffle",
      ],
      answer: 1,
      explain:
        "偏差来自选择，不来自测试集更大。候选越多，赢家的验证误差越容易偏乐观。所以需要一份完全没参加过选择的测试集。",
    },
  },
  {
    id: "ex6",
    n: 6,
    title: "用新数据检查这些估计",
    marks: "15 分",
    why: "模拟数据可以无限再生成。这一题才允许你看真实函数和噪声，用来检查：验证误差和测试误差各自离真误差有多远。",
    steps: [
      "现在可以打开 make_data.py。",
      "用 make_data.make(10000, rng) 造一万个新点。",
      "在这上面算最终模型的误差，再算真实函数 g 的误差。",
      "g 的误差应该接近 σ²。拿它和第 2 题你从图上估的噪声下限比。",
      "再把第 3 题那个 H = 20、λ = 0、练满 20000 轮的网络也放到这一万个点上。",
    ],
    code: `import make_data
rng = np.random.default_rng(123)
xbig, ybig = make_data.make(10000, rng)
fit.mse(net, xbig, ybig)
np.mean((make_data.true_function(xbig) - ybig) ** 2)`,
    avoid: "不要用这一万个点去重新挑选 H 或 λ。它们是检查，不是又一个验证集。",
    write: "说出验证误差和测试误差谁离真误差更近。过拟合的网络在 [-2, 2] 的哪些地方误差大，要对着第 3 题的图说，因为它在训练点之间或两端去追了噪声。最后用两三句写：真实问题里你只有三个损失，能下什么结论。",
    check: {
      type: "choice",
      id: "p6",
      prompt: "真实数据上做不到这一题。只凭训练、验证、测试三个损失，哪一句是你能说的？",
      options: [
        "测试损失就是噪声下限 σ²",
        "训练损失小只说明贴住了训练点。验证损失用来选过模型，所以偏乐观。测试损失是真误差的一次带噪声的估计",
        "三个数里最小的那个就是该部署的模型",
      ],
      answer: 1,
      explain:
        "你仍然不知道真实函数，也不知道自己离噪声下限还差多少。测试损失是估计，60 个点时它自己也有起伏。第 6 题的奢侈在于你能生成一万个点去看这个起伏。",
    },
  },
  {
    id: "ex7",
    n: 7,
    title: "Adam 和普通梯度下降",
    marks: "10 分",
    why: "同一份训练损失，优化器不同、学习率不同，下降的速度差很多。慢的优化器有时验证误差更好，因为它还没来得及过拟合。",
    steps: [
      "H = 20，只在训练集上练 20000 轮。",
      "SGD 的学习率：0.01、0.1、0.3、1.0。",
      "Adam 的学习率：0.01、0.001。",
      "六条训练损失对轮数画在同一张双对数图上。",
      "每条报告第一次降到 0.2 以下的轮数，或者从未降到。",
    ],
    code: `fit.train(xtr, ytr, hidden=20, epochs=20000, optimiser="sgd", lr=0.01)
fit.train(xtr, ytr, hidden=20, epochs=20000, optimiser="adam", lr=0.001)`,
    avoid: "这一题比的是训练曲线和学习率，不要为了让 SGD 好看去改数据划分。",
    write: "Adam 对学习率没那么娇气。普通梯度下降学习率不合适时，要么几乎不动，要么发散；1.0 那条要按你自己的图描述，并把原因说成步长太大。学习率 0.01 的 SGD 如果训练损失还高、验证损失却更好，用第 3 题的话解释：它还停在先学大形状的阶段。",
    check: {
      type: "choice",
      id: "p7",
      prompt: "慢的 SGD 练满 20000 轮，训练损失仍比 Adam 高，验证损失却可能更低。这是为什么？",
      options: [
        "SGD 的数学保证验证误差更小",
        "它还没走到贴噪声的阶段。看起来像个好模型，其实和早停一样，是还没练完",
        "因为 optimiser=\"sgd\" 会自动使用验证集",
      ],
      answer: 1,
      explain:
        "作业 (c) 就是让你把这件事和第 3 题连起来。验证损失低，不一定是优化器更好，也可能是它还没来得及把容量用在噪声上。",
    },
  },
  {
    id: "ex8",
    n: 8,
    title: "自己问一个问题",
    marks: "20 分",
    why: "没有标准答案。分数在问题清不清楚、实验能不能回答它、结论写不写得明白，以及是不是你自己的问题。干净的负面结果可以得高分。",
    steps: [
      "用一句话把问题写在最上面。",
      "改 fit.py 或 make_data.py 里真正影响这个问题的那一处。",
      "测试集规矩还在：选模型时不要看它。",
      "计算量控制在笔记本上几分钟。要过夜就说明该简化。",
    ],
    avoid: "把第 2 到 4 题换一个数字再做一遍，和全班都会写的一样。这种拿很少的分。",
    write: "最容易接上你刚写过的 PyTorch 的两个方向：把 Sigmoid 换成 ReLU，重做容量扫描，问验证曲线和权重衰减还是否一样；或者改训练/验证的切分大小，看选中的 H 和测试误差晃多少。",
    check: {
      type: "choice",
      id: "p8",
      prompt: "哪一种第 8 题更像作业想要的？",
      options: [
        "把 H 的列表改成 0, 4, 8, 16，其余和前几题一样",
        "问一句清楚的话，改一处代码，实验回答这句，包括结果是“几乎没变”",
        "把网络改成五层、训练一整夜，再附上很多图",
      ],
      answer: 1,
      explain:
        "评分看问题、设计、结论、原创，大约各四分之一。负面结果可以。没有问题的大实验分很低。ReLU 那一处你在上一页已经写过，实验和解释仍要对着你自己的图写。",
    },
  },
];

export const allCards: Card[] = [
  ...words,
  ...rules,
  ...torchSteps,
  ...chapters.map((chapter) => chapter.check),
];
