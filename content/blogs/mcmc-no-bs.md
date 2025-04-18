---
title: Markov Chain Monte Carlo (MCMC) - No BS
date: April 17, 2025
author: Sujay Kapadnis
---

Have been reading this [article](https://www.jeremykun.com/2015/04/06/markov-chain-monte-carlo-without-all-the-bullshit/) for a while now and it's a great read, thus taking my own notes to understand it better.

### What is Markov Chain Monte Carlo (MCMC)?
- To put it simply, it's a technique to solve problem of random sampling from a complex distribution.
- Imagine I got myself a cat(I love cats), now I want to give it a name, but there are a lot of possibilities like "Oscar", "Lando", "Max", "Lewis" etc. I have a friend who also likes cats and in one shady market he bought a magic box which upon custom settings for me, given a name will return the probabilty of that name being the name of my cat.
- That custom settings is called the distribution specific to my preferences. (Consider that it can't be tempered)
- Since the names are Distinct, D is a Discrete probability distribution and for discrete distributions, we can define a probability mass function (PMF) which is a function that gives the probability of a discrete random variable taking a certain value (in our case, the cat name)
- In reality, these distributions are skewed, where popular names like (lewis, Max) have higher probability than others.
- Now any person would think it is a good idea, keep giving it names and it will give me sort of compatibility of that name that I look for my cats, so after say a few tries, it gives a high probability to the name "Carlos", and since it was customized to me, I'm fairly happy with it.
- You might wonder, what is the problem? and where does MCMC come into picture?
- The problem is I want to draw names from that distribution, but effeciently! Why the current process not efficient? you ask. Well, I don't know what method that magic box uses to give me the probability, can I simulate it? No, I might even get biased towards it, just because I've been told that it will help you decide a good name, so I might start thinking that "Carlos" is a good name, even it might not be, maybe "Kimi" was the perfect name.

Sampling directly from D is hard because:
 - You don’t know the internal process that defines 𝐷 (i.e., how you pick names).
 - 𝐷 is complicated, with potentially many names and uneven probabilities.
 - Direct sampling (e.g., listing all names and their probabilities) is impractical due to the large number of possible names.

Now, let's add one more layer to this to avoid that forced bias, once we get the probability of that name, we'll also carry a biased coin, which we'll flip to decide whether to accept that name or not.

#### Uniform Sampling with a Biased Coin
- Generate a name 𝑥 uniformly at random: Pick a name from the set of all possible names, where each name has an equal chance of being chosen. For example, if there are 10,000 names, each has a 1/10000 chance of being picked.
- Query the magic box for 𝑃(𝑥): Ask the box for the probability 𝑃(𝑥) that you would choose name 𝑥 according to 𝐷.
- Flip a biased coin with probability 
𝑃(𝑥): Use a coin where the probability of landing on heads is 
𝑃(𝑥) If the coin lands heads, accept 𝑥 as your sample. If it lands tails, reject 𝑥 and start over (generate a new name and repeat).

**Why This Setup?**: This is a form of rejection sampling. The coin flip ensures that names with higher 𝑃(𝑥) are more likely to be accepted, so the accepted names follow the distribution 𝐷 However, it’s inefficient.

It's  inefficient because:
**Exponentially many names**: Exponentially many names: There are a vast number of possible names. The variable here is the number of bits needed to write down a name n=∣x∣ refers to the length of a name when encoded as a string (e.g., in a computer or as a sequence of characters).

Problematics Cases: 
 1. Probabilities are exponentially small: If most names have very low probabilities (𝑃(𝑥) is tiny), the coin will rarely land heads, so you’ll reject most names and need many tries to get a sample.
 2. Few names have nonzero probability: If only a few names have significant probabilities, you’ll rarely generate those names randomly, so you’ll need many tries to hit one.