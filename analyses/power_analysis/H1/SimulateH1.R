##### SETUP ####
# function to load packages or install if not already installed
ipak <- function(pkg){
  new.pkg <- pkg[!(pkg %in% installed.packages()[, "Package"])]
  if (length(new.pkg)) 
    install.packages(new.pkg, dependencies = TRUE)
  sapply(pkg, require, character.only = TRUE)
}
packages <- c("dplyr", "ggplot2", "grid", 'gridExtra', 'lme4', 'reshape2', 'optimx')
ipak(packages)
rm(packages, ipak)

# SET CONSTANTS 
samples = seq(20,100, by=20) # list of sample sizes to test for power 
nSim = 10 # number of simulations per sample size -- keep small, since binomial models take awhile to fit 
alpha = 0.05 # alpha threshold
nb = 16 # num of blocks
nt = 50 # num of trials per block
stablefreq <- rep(0.5, nb) # stable prevalence condition 
decreasefreq <- c(.5,.5,.5,.5,.4,.28,.14,.06,.06,.06,.06,.06,.06,.06,.06,.06) # changing prevalence condition 

# Create df to store data in 
PowerAnalysis <- data.frame(n=numeric(), 
                            sim = numeric(), 
                            estimate = numeric(), 
                            se= numeric(), 
                            p = numeric())
# FUCTIONS TO USE 
# randomize stimuli 
stimRandomizer <- function(freq,numtrials) {
  mena = c()
  white = c()
  for (i in seq(from=10, to=300, by=10)) {
    if (i < 100) {
      mena = c(mena, paste0('stim/T0',i,'.jpg'))
      white = c(white, paste0('stim/H0',i,'.jpg'))
    } else {
      mena = c(mena, paste0('stim/T',i,'.jpg'))
      white = c(white, paste0('stim/H',i,'.jpg'))
    }
  }
  signals = sample(white, round(numtrials*freq))
  if (round(numtrials*(1-freq)) <= length(mena)){
    noise = sample(mena, round(numtrials*(1-freq)))
  } else {
    noise = sample(mena, round(numtrials*(1-freq)), replace = T)
  }
  stim = sample(c(signals, noise), numtrials)
  
  return(stim)
}

# Predict participants potential responses based on parameters in the model 
SimChoices = function(f, beta, lambdaF, lambdaC){ # calculates probability of choice in model-based analysis below
  Fbar = c(0) # list of exponentially weighted past stimuli 
  Cbar = c(0) # list of exponentially weighted past responses 
  CP = c() # choice probabilities 
  resp = rep(1, length(f)) # dummy responses; used to indicate the probability of choosing 1 
  for(t in seq(length(f))){
    
    # predict choice probability from regression parameters
    dV = beta[1] + beta[2]*f[t] + beta[3]*Fbar[t] + beta[4]*Cbar[t] 
    P = 1/ (1 + exp(dV)) 
    CP[t] <- 1-P
    
    Fbar[t+1] <- lambdaF*Fbar[t] + f[t] # update list weighing it by decay parameter lambda
    Cbar[t+1] <- lambdaC*Cbar[t] + resp[t]
  }
  return(CP) # represents the probability of presssing 1
}

#### SIMULATE #### 
for(n in samples) {
  for(s in 1:nSim) { 
    print(paste0('Simulation ', s, '/',nSim,' for a sample size of ', n)) # keep track 
    
    SimData <- data.frame(id = rep(1:n, each=nt*nb), 
                           condition=rep(0:1, each=(n*nt*nb)/2), 
                           trial = rep(1:(nt*nb), times=n), 
                           block = rep(rep(1:nb, each=nt), times=n))
    SimData$freq <- ifelse(SimData$condition==0, 0.5, 
                            decreasefreq[SimData$block])
    
    for(id in unique(SimData$id)){
      SimData[SimData$id == id, 'stim'] <- ifelse(SimData[SimData$id == id, 'condition'] == 0, 
                                                    sapply(stablefreq, stimRandomizer, numtrials=nt), 
                                                    sapply(decreasefreq, stimRandomizer, numtrials=nt)
      )
    }
    rm(id)
    
    SimData$size <- ifelse(substr(SimData$stim, start = 6, stop = 6) == 'H', 
                            as.numeric(substr(SimData$stim, start = 7, stop = 9)) + 300, 
                            abs(as.numeric(substr(SimData$stim, start = 7, stop = 9))-310)
    )
    
    # write.csv(SimData, 'SimulatedData(noresp).csv', row.names = F)
    
    # SIMULATE RESPONSE 
    SimData$f <- 2*((SimData$size - min(SimData$size))/(max(SimData$size) - min(SimData$size))) - 1 # objective value of size; higher means more white
    
    # simulate responses for each subject; 1 = white judgement, -1 = mena judgements 
    simresp <- c()
    for (id in unique(SimData$id)){
      # parameter based on Wilson (2018; Study 6 params.) 
      # with the exception of the B0, which for some reason is positive in his Fig. 4
      p <- c(rnorm(1, mean=-4.5, sd=0.1), 
              rnorm(1, mean=8, sd=0.1), 
              rnorm(1, mean=-0.8, sd=0.25), 
              rnorm(1, mean=0.8, sd=0.1), 
              rnorm(1, mean=0.7, sd=0.25), 
              rnorm(1, mean=0.4, sd=0.1))
    
      d.subject <- SimData[SimData$id == id, ]
      CP = SimChoices(d.subject$f, p[1:4], p[5], p[6]) # probability of pressing 1
      simresp <- c(simresp, 
                   sapply(seq_along(CP), function(i){sample(size=1, x=c(1, -1), prob=c(CP[i], 1-CP[i]))}))
    }
    
    SimData$simresp <- simresp
    
    # GLMM REGRESSIONS 
    SimData$trial0 <- SimData$trial/max(SimData$trial)
    SimData$size0 <- SimData$size/max(SimData$size)
    SimData$condition <- as.factor(SimData$condition)
    SimData$id <- as.factor(SimData$id)
    SimData$simresp <- ifelse(SimData$simresp == -1, 0, 1) # mena judgements now == 0
    
    m <-  glmer(simresp ~ (condition + trial0 + size0)^3 + (trial0 | id),
                             family = binomial,
                             control=glmerControl(optimizer="optimx", calc.derivs = F, 
                             optCtrl = list(method = "nlminb", starttests = FALSE, kkt = FALSE)), 
                             nAGQ=0, 
                             data = SimData)
    
    # store data from this simulation
    PowerAnalysis[nrow(PowerAnalysis)+1,] <- c(n, s, 
                                               summary(m)$coefficients[8,1], # estimate
                                               summary(m)$coefficients[8,2], # se
                                               summary(m)$coefficients[8,4]) # p-value
  }
}

##### VISUALIZE POWER ####
PowerAnalysis %>% group_by(n) %>% 
  summarise(power = length(p[p<alpha])/length(p), 
            se = sqrt((power*(1-power))/length(p))) %>% 
ggplot(aes(x = n, y=power)) +
  geom_point() +
  geom_errorbar(aes(ymin=power-se, ymax=power+se), width=.25) + 
  geom_line() + 
  geom_hline(yintercept = 0.8, linetype='dashed') + ylim(c(0, 1)) + 
  labs(x = 'Sample Size', y = 'Power (% Simulated Data Set Sig.)', 
       caption = paste0('n = ', nSim, ' simulations per sample size.')) + 
  theme_classic() + theme(plot.caption = element_text(size=12, hjust=0))


#### VISUALIZE LAST SIMULATION ####
SimData  %>% 
  mutate(condition = factor(ifelse(SimData$condition == 0, 
                                   'Stable Prevalence Condition',
                                   'Decreasing Prevalence Condition'), 
                            levels = c('Stable Prevalence Condition', 'Decreasing Prevalence Condition'))) %>% 
  mutate(trialintensity = size/10) %>% 
  mutate(trial = as.numeric(trial)) %>% 
  mutate(timebin4 = as.factor(apply(as.matrix(trial), 2, cut, c(seq(0,800,200)), labels=FALSE))) %>%
  group_by(condition, trialintensity, timebin4) %>% 
  summarise(pBlue = length(simresp[simresp == 1])/length(simresp)) %>%
  rename(colour = trialintensity, trialbins = timebin4) %>% 
  filter(trialbins == 1 | trialbins == 4) %>% 
  ggplot(aes(x = colour, y = pBlue, color = trialbins)) + geom_point() + 
  geom_line(stat="smooth",method = "glm", method.args = list(
    family="binomial"), se=FALSE,size=1.8,alpha=.7) + 
  ylab('% Faces Judged as Caucasian') + xlab('') +
  scale_colour_manual(labels=c("Initial 200 trials", "Final 200 trials"), name=NULL,values=c("#0066CC", '#990000')) +
  scale_y_continuous(labels = scales::percent) +
  scale_x_continuous(breaks = c(5, 54), 
                     labels = c('Very Middle-Eastern', 'Very White')) + 
  theme_bw() + 
  #ylim(c(0.00, 1.00)) + 
  facet_wrap(~condition, nrow = 1) + 
  theme(axis.ticks.x = element_blank(), plot.title = element_text(hjust = 0.5), 
        legend.position = 'none', 
        axis.text.y = element_text(size = 10),
        axis.text.x = element_text(size = 10, colour = 'black'), 
        axis.title.y = element_text(size = 12), 
        strip.background = element_blank(),
        strip.placement = "outside", 
        strip.text = element_text(size = 12)) 
