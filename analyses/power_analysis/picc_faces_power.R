getwd()
# "C:/Users/User/Documents/LDM Lab/Immigration/Power Analysis"
#load("C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim100.RData")
setwd("C:/Users/User/Documents/Nathalie/LDM/PICC_FACES")

library(purrr)
library(dplyr)
library(readr)
library(lme4)

# Specify coefficients -----------------------------------------------------------

# Set up the coefficients for the predictive model: 
#   Condition = whether the prevalence of non-white faces increases (1) or stays stable (0)
#   Trial     = trial number (1-800)
#   Strength  = Stimulus strength; how white the face is, based on validation scores (1-100)
# Trials and strength are scaled to be between and 0 and 1

# Qualitative explanation of expected coefficients: 
#   Intercept: Very small value because it is unlikely to judge a low strength stimuli as white (could change with centering)
#   condition: Positive effect because the overall judgment of whiteness should increase with increasing prevalence of non-white faces
#   trial: Small, positive effect, because judgments of non-white faces in the stable condition should not be very sensitive to change across trials 
#   strength: Strong and positive effect
#   condition:strength: Negative effect because an increase in the prevalence of non-white faces should decrease the objective effect of stimulus strength
#   condition:trial: Small positive effect, only because strength==0 (could change with centering)
#   strength:trial: Small effect because we do not expect trial to influence strength much in stable condition
#   condition:trial:strength: Minimum effect of interest

# step 1
{
minOR = 6                        # minimal expected 3-way interaction (VERY small compared to past findings)
gammas = c(                      # predicted fixed effects in full model in OR (0=white, 1=immigrant)
  intercept=0.01,                     # when condition, trial, and strength == 0, odds of judging someone as white 
  condition=1.5,                      # change from intercept when conditon+=1, but trial and strength == 0
  trial0=2,                           # change from intercept when trial+=1, but condition and strength == 0
  strength0=1e5,                      # change from intercept when strength+=1, but condition and strength == 0
  `condition:strength0`=.5,           # change in effect of strength when condition+=1, but trial==0
  `condition:trial0`=.1,              # change in effect of trial when condition+=1, but strength==0
  `strength0:trial0`=.15,             # change in effect of strength when trial+=1, but condition==0
  `condition:trial0:strength0`=minOR  # change in effect of strength:trial when condition+=1
)
gammas.LOR = log(gammas)
taus = c(                            # random effects (assume minimal individual differences for now)
  tau00=1.10, 
  tau_trial=1.1
)

# Set up design matrix ----------------------------------------------------
# var freqs = [.8,.8,.8,.8,.64,.45,.25,.10,.10,.10,.10,.10,.10,.10,.10,.10] // from levari study 5, adjusted to be /80 instead of /50

Ns = seq(10, 100, by=10)         # sample sizes to test
Nsim = 100                      # number of simulations per sample size
nTrials = 800                    # number of trials per sample
nb = 16                          # number of blocks
nt = nTrials/nb                  # number of trials per block
stable_freq=rep(.8, nb)          # ratio of white to non-white faces in stable condition
increase_freq=c(.8,.8,.8,.8,.64,.45,.25,.10,.10,.10,.10,.10,.10,.10,.10,.10)


# Simulate design matrices
stimRandomizer <- function(freq,numtrials) {
  # randomizes the noise/signal ratio as a function of the frequency 
  # for a set number of trials
  w=1:29
  nw=31:61
  signals = sample(w, round(numtrials*freq), replace = T)
  if (round(numtrials*(1-freq)) <= length(nw)){
    noise = sample(nw, round(numtrials*(1-freq)), replace = T)
  } else {
    noise = sample(nw, round(numtrials*(1-freq)), replace = T)
  }
  stim = sample(c(signals, noise), numtrials, replace = T)
  return(stim)
}

DesignMatrices <- list()
for(N in Ns){
  cat('creating design matrix for sample size=', N, '\n')
  for(s in 1:Nsim){
    thisDM = data.frame(id = rep(1:N, each=nTrials), 
                        block=rep(rep(1:nb, each=nt), N), 
                        trial=rep(1:nTrials, N),
                        trialinblock=rep(1:nt, nb*N), 
                        condition=c(rep(0, nTrials*(N/2)), rep(1, nTrials*(N/2))))
    
    conds = tapply(thisDM$condition, thisDM$id, function(x) x[1])
    strength=c()
    for(i in conds){
      if(i==1){thisf=increase_freq}else{thisf=stable_freq}
      thisstr=sapply(thisf, function(x) stimRandomizer(x,nt), simplify = T)
      strength=c(strength, unlist(thisstr))
    }
    thisDM$strength=strength-1 # nicer numbers
    
    DesignMatrices[[length(DesignMatrices)+1]] = thisDM
    
  }
}
cat('DONE CREATING DESIGN MATRICES///MOVING ON TO SIMULATION\n')
}


# Simulate responses with MLM params and model for significance ------------------------------------

library(lme4)

# step 2
{
Pwr = data.frame(stringsAsFactors = F)
for(i in 1:length(DesignMatrices)){
  thisDM = DesignMatrices[[i]]
  U0j = rnorm(length(unique(thisDM$id)),0, sqrt(taus['tau00']))
  Utrial=rnorm(length(unique(thisDM$id)),0, sqrt(taus['tau_trial']))
  thisDM$trial0 = thisDM$trial/max(thisDM$trial)
  thisDM$strength0 = thisDM$strength/max(thisDM$strength)
  
  resps=list()
  for(id in 1:length(unique(thisDM$id))){
    thisDM.sub = thisDM[thisDM$id==id,]
    b0 = gammas.LOR['intercept'] + gammas.LOR['condition']*thisDM.sub$condition + U0j[id]
    b1 = gammas.LOR['trial0'] + gammas.LOR['condition:trial0']*thisDM.sub$condition + Utrial[id]
    b2 = gammas.LOR['strength0'] + gammas.LOR['condition:strength0']*thisDM.sub$condition
    b3 = gammas.LOR['strength0:trial0'] + gammas.LOR['condition:trial0:strength0']*thisDM.sub$condition
    lor = b0 + b1*thisDM.sub$trial0 + b2*thisDM.sub$strength0 + b3*(thisDM.sub$strength0*thisDM.sub$trial0)
    p=exp(lor)/(1+exp(lor))
    resps[[id]] = rbinom(length(p), size=1, p)
  }
  thisDM$response = unlist(resps)
  
  # Model! 
  cat('fitting iteration', i, 'of', length(DesignMatrices), '( N =',length(unique(thisDM$id)), ')\n')
  gmlm = glmer(response~condition*strength0*trial0 + (trial0|id), data=thisDM, family='binomial', nAGQ=0)
  
  # Store iteration
  sum = summary(gmlm)$coefficients
  out=matrix(NA, nrow=1, ncol=length(sum))
  for(c in 1:length(sum)){
    out[,c] = sum[c]
  }
  out = data.frame(out, stringsAsFactors = F)
  n = expand.grid(rownames(sum), c('_b', '_se', '_z', '_p'))
  colnames(out) = paste0(n[,1], n[,2])
  out$N = length(unique(thisDM$id))
  Pwr = rbind(Pwr, out)
}
}


# simulation one
#done
sim_one <- thisDM
sim_one_sub <- thisDM.sub
pwr_one <- Pwr
# save to disk just in case
write.csv(sim_one, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_one.csv")
write.csv(sim_one_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_one_sub.csv")
write.csv(pwr_one, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_one.csv")

# see if just sim one alone works


# use gc() to free up memory and clear everything in between
# probably not very efficient, but works on my machine

# simulation two
#done
sim_two <- thisDM
sim_two_sub <- thisDM.sub
pwr_two <- Pwr
# save to disk just in case
write.csv(sim_two, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_two.csv")
write.csv(sim_two_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_two_sub.csv")
write.csv(pwr_two, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_two.csv")

# simulation three
#done
sim_three <- thisDM
sim_three_sub <- thisDM.sub
pwr_three <- Pwr
# save to disk just in case
write.csv(sim_three, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_three.csv")
write.csv(pwr_three, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_three.csv")
write.csv(sim_three_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_three_sub.csv")

# simulation four
#done
sim_four <- thisDM
sim_four_sub <- thisDM.sub
pwr_four <- Pwr
# save to disk just in case
write.csv(sim_four, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_four.csv")
write.csv(pwr_four, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_four.csv")
write.csv(sim_four_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_four_sub.csv")

# simulation five
#done
sim_five <- thisDM
sim_five_sub <- thisDM.sub
pwr_five <- Pwr
# save to disk just in case
write.csv(sim_five, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_five.csv")
write.csv(pwr_five, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_five.csv")
write.csv(sim_five_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_five_sub.csv")


# simulation six
#done
sim_six <- thisDM
sim_six_sub <- thisDM.sub
pwr_six <- Pwr
# save to disk just in case
write.csv(sim_six, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_six.csv")
write.csv(pwr_six, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_six.csv")
write.csv(sim_six_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_six_sub.csv")

# simulation seven
#done
sim_seven <- thisDM
sim_seven_sub <- thisDM.sub
pwr_seven <- Pwr
# save to disk just in case
write.csv(sim_seven, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_seven.csv")
write.csv(pwr_seven, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_seven.csv")
write.csv(sim_seven_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_seven_sub.csv")

# simulation eight
#done
sim_eight <- thisDM
sim_eight_sub <- thisDM.sub
pwr_eight <- Pwr
# save to disk just in case
write.csv(sim_eight, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_eight.csv")
write.csv(pwr_eight, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_eight.csv")
write.csv(sim_eight_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_eight_sub.csv")

# simulation nine
#done
sim_nine <- thisDM
sim_nine_sub <- thisDM.sub
pwr_nine <- Pwr
# save to disk just in case
write.csv(sim_nine, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_nine.csv")
write.csv(pwr_nine, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_nine.csv")
write.csv(sim_nine_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_nine_sub.csv")

# simulation ten
# done
sim_ten <- thisDM
sim_ten_sub <- thisDM.sub
pwr_ten <- Pwr
# save to disk just in case
write.csv(sim_ten, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_ten.csv")
write.csv(pwr_ten, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power_ten.csv")
write.csv(sim_ten_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_ten_sub.csv")

# done all 10 simulations

Nsim = 1000
# 1000 simulations per sample size, so 10,000 simulations total
totalparticipants <- 10000 + 20000 + 30000 + 40000 + 50000 + 60000 + 70000 + 80000 + 90000 + 100000 
# 550 000 total participants

# add everything together
# "C:/Users/User/Documents/LDM Lab/Immigration/Power Analysis"
setwd("C:/Users/User/Documents/Nathalie/LDM/PICC_FACES")

# Power ----------------------------------------------------

setwd("C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/pwr")

{  
  power <-
    list.files(pattern = "*.csv") %>% 
    map_df(~read_csv(., col_types = cols(.default = "c")))
}

power$X1 = c(1:10000)
names(power)[1]<-paste("run")

Pwr <- mutate_all(power, function(x) as.numeric(as.character(x)))

write.csv(power, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/power10000.csv")

# Simulated participants ----------------------------------------------------

setwd("C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim")

{  
  sim_p <-
    list.files(pattern = "*.csv") %>% 
    map_df(~read_csv(., col_types = cols(.default = "c")))
}

sim_p$X1 = c(1:800000)
names(sim_p)[1]<-paste("run")
sim_p$id <- rep(1:1000, each = 800)

write.csv(sim_p, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim.csv")

#thisDM <- sim_p
thisDM <- mutate_all(sim_p, function(x) as.numeric(as.character(x)))

# Simulated sub participants ----------------------------------------------------

setwd("C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sub")

{  
  sim_sub <-
    list.files(pattern = "*.csv") %>% 
    map_df(~read_csv(., col_types = cols(.default = "c")))
}

sim_sub$X1 = c(1:8000)
names(sim_sub)[1]<-paste("run")
write.csv(sim_sub, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_sub.csv")

# Visualise Power Curve ----------------------------------------------------

# Power curve
alpha = .05 
Pwr$sig = ifelse(Pwr$`condition:strength0:trial0_p` < alpha, 1, 0)
pSig = tapply(Pwr$sig, Pwr$N, mean)
plot(names(pSig), pSig, type='b', ylim=c(0,1), 
     xlab = 'Sample Size', ylab='p(Significant)')
abline(h=.8, lty='dashed')
legend('bottomright', bty='n', cex=.75,legend=paste0(Nsim, ' samples per sample size, N = 550,000'))
# sapply(Pwr[,1:8], mean)
# gammas.LOR

# Last simulation
thisDM$timebin = dplyr::ntile(thisDM$trial, 4)
thisDM$stimbin = dplyr::ntile(thisDM$strength, 10)
pWhite = tapply(thisDM$response, list(thisDM$timebin, thisDM$stimbin, thisDM$condition), mean)

# plot average stim strength across blocks for this simulation
x=tapply(thisDM$strength, list(thisDM$condition, thisDM$block), mean)
plot(1:nb, x[1,], type='n', xaxt='n', ylab='Average Stimulus', xlab='Block',
     ylim=range(pretty(x)), yaxt='n')
axis(2, at=c(min(x), max(x)), labels = c('White', 'Middle\nEastern'))
axis(1,at=1:nb, labels = 1:nb)
pchs=c(1,16)
for(i in 1:nrow(x)) lines(1:nb,x[i,], type='b', pchs[i])
legend('right', pch=pchs, legend=c('Stable', 'Changing'), title='Condition', bty='n')

#save.image("C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/Natsim10000.RData")

# plot the curves of the effect

X11(width=10, height=5)
layout(matrix(1:2, ncol=2))
for(c in 1:dim(pWhite)[3]){
  title=ifelse(c==1, 'No Change in Demographics', 'More Middle-Easterners')
  thiscond = pWhite[,,c]
  plot(as.numeric(colnames(thiscond)), thiscond[1,], type='n', xaxt='n', 
       xlab='Central-European-ness (CE)', ylab='p(Judge as Middle-Eastern)', ylim=c(0,1), 
       main=title)
  axis(1, at=c(1,10), labels=c('Not CE', 'Very CE') )
  lines(thiscond[1,], type='b')
  lines(thiscond[4,], type='b', pch=16)
  if(c==2) legend('bottomright', pch=c(1,16), legend=c('First 200 trials', 'Last 200 Trials'))
  
  
}

# Run simulation model --------------------------------------------------------->

sim_p <- read_csv("Nathalie/LDM/PICC_FACES/sim.csv")
sim_sample <- select(sim_p, id, condition, response, trial0, strength0)

write.csv(sim_sample, "C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/sim_sample.csv")
sim_sample <- read_csv("Nathalie/LDM/PICC_FACES/sim_sample.csv", 
                       col_types = cols(...1 = col_skip()))

m3=glmer(response~trial0*condition*strength0+(1|id), data=sim_sample, family='binomial')

anova(m3) 
summary(m3)

confint(profile(m3))
m3CI <- confint(m3, method="Wald", oldNames = FALSE)
