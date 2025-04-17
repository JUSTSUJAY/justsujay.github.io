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
- Now any person would think it is a good idea, keep giving it names and it will give me sort of compatibility of that name that I look for my cats, so after say a few tries, it gives a high probability to the name "Carlos", and since it was customized to me, I'm fairly happy with it.
- You might wonder, what is the problem? and where does MCMC come into picture?
- The problem is I want to draw names from that distribution, but effeciently! Why the current process not efficient? you ask. Well, I don't know what method that magic box uses to give me the probability, can I simulate it? No, I might even get biased towards it, just because I've been told that it will help you decide a good name, so I might start thinking that "Carlos" is a good name, even it might not be, maybe "Kimi" was the perfect name.
- 