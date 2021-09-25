# R script to analyze pilot data from the PICC immigration study
# @author: Sean
# @editor: Nathalie
# @date: 2021-09-24

setwd("C:/Users/User/Documents/Nathalie/LDM/PICC_FACES/Pilot/PICCImmigration-main/data")

# 1. Load data ------------------------------------------------------------
library(purrr)
library(dplyr)
library(readr)

{  
  choice <-
    list.files(pattern = "*.csv") %>% 
    map_df(~read_csv(., col_types = cols(.default = "c")))
}

choice <- select(choice, 'ID', 'age', 'gender', 'ethnicity','condition', 'block',
                 'trial', 'stimulus', 'key_press', 'rt', 'freq')

# 2. Clean data -----------------------------------------------------------

choice = choice[choice$ID!='1', ]                            # remove extra debug subject
choice$stimulus = dplyr::lag(choice$stimulus)                # the stimulus in the raw data is one behind the actual response, so use the lag function() from the dplyr package to match things up
choice = choice[!is.na(choice$trial), ]                      # delete all rows from the data frame where the trial variable is NA
choice$stimulus = sub(".*/", "", choice$stimulus)            # remove all the extra junk from the stimulus columns (e.g., "images/blabla)
choice$stimulus = sub(".jpg", "", choice$stimulus)           # same as above, remove the .jpeg from each stimulus 
# Below is a little code to get the stimulus data on a scale from 0-600
# Basically, if the data has a T, substract it from 300. This means that T300 = 0 (i.e., most non-white)
# Conversely, if the data has an H we add 300. This means that H300 = 600 (i.e., the most white). 
choice$intensity = ifelse(
  substring(choice$stimulus, 1, 1) == 'T',
  300 - as.numeric(substring(choice$stimulus, 2, 4)), 
  300 +  as.numeric(substring(choice$stimulus, 2, 4))
  )

choice = choice[choice$block!='Practice', ]                  # remove practice trials
nTrials = 800                                                # how many trials each subject is supposed to have
nTrialID = tapply(choice$trial, choice$ID, length)           # how many trials each subject actually has
choice = choice[!choice$ID %in% names(nTrialID[nTrialID != nTrials]) ,] # remove subejcts who have too few/too many trials

choice$response = ifelse(choice$key_press == 76, 1, 0)       # replace key_press with numeric values (1=non-white, 0=white)
choice$block = as.numeric(choice$block)                      # make block number a numeric variable
choice$stimbin = dplyr::ntile(choice$intensity, 10)          # create 'bins' of stimuli. This is used for visualizing the data.
choice$trialinblock = choice$trial                           # just some renaming for organization
choice$trial = unlist(by(choice$trial, choice$ID, function(x) 1:length(x))) # overall trial number from 1-800
choice$timebin = dplyr::ntile(choice$trial, 4)               # create bins of trial. This is also for visualization (i.e., first and last 200 trials)

# remove me and look at demographics alone

choice <- subset(choice, ID != 'nathalie')
  demog <- subset(choice, trial == '800') #1 line per person
  
  demog <- select(demog, 'ID', 'age', 'gender', 'ethnicity')
  table(demog$gender)
  demog$age <- as.numeric(demog$age)
  men <- subset(demog, gender == 'Male')
  women <- subset(demog, gender == 'Female')
  
  
  mean(women$age)
  mean(men$age)
  
  sd(women$age)
  sd(men$age)
  
  library(janitor)
  tabyl(men$ethnicity, sort = TRUE)
  tabyl(women$ethnicity, sort = TRUE)
  

# Demographics ------------------------------------------------------------

N = length(unique(choice$ID))                                # number of subjects
conds = table(choice$condition)/nTrials                      # N subjects in each condition
genders = table(choice$gender)/nTrials                       # gender breakdown
ages = table(choice$age)/nTrials                             # age breakdown
ethnicities = table(choice$ethnicity)/nTrials                # ethnicity breakdown

# visualize ethnicities if you want
# tb = barplot(sort(ethinicities), xaxt='n')
# labs = sapply(names(sort(ethnicities)), function(x) strsplit(x, 'or')[[1]][1])
# axis(1, at=tb, labels=labs )


# Plot frequency (manip check) ----------------------------------------------------------

pdf('plots/manipulationchecks.pdf')

mFreq = tapply(choice$freq, list(choice$condition, choice$block), mean)
plot(mFreq[1,], type='n', xaxt='n', xlab='Block', ylab='p(White Faces)', ylim=c(0,1))
axis(1, at=1:length(mFreq[1,]), label=1:length(mFreq[1,]))
cols=c('red')
for(i in 1:nrow(mFreq)){
  lines(mFreq[i,], col=cols[i], type='b', pch=16)
}
#legend('topright', lty=1, pch=16, col=cols, legend=c('Stable', 'Changing'), title='Prevalence')

mInt = tapply(choice$intensity, list(choice$condition, choice$block), mean)
plot(mInt[1,], type='n', xaxt='n', xlab='Block of Trials', ylab='Average Central European-ness', ylim=range(pretty(mInt)))
axis(1, at=1:length(mInt[1,]), label=1:length(mInt[1,]))
cols=c('red')
for(i in 1:nrow(mInt)){
  lines(mInt[i,], col=cols[i], type='b', pch=16)
}
#legend('topright', lty=1, pch=16, col=cols, legend=c('Stable', 'Changing'), title='Prevalence')

dev.off()

# Plot main effect --------------------------------------------------------
pdf('plots/responsecurve.pdf')

mResp = tapply(choice$response, list(choice$timebin, choice$stimbin), mean)
mResp = mResp[c(1,4), ]
seResp = tapply(choice$response, list(choice$timebin, choice$stimbin), plotrix::std.error)
seResp = seResp[c(1,4), ]

plot(mResp[1,], type='n', xaxt='n', ylab='p(Judge face as Central European)', xlab='',
     ylim=range(pretty(mResp)))
axis(1, at=c(1,10), label=c('Not Central European', 'Very Central European'))
cols=c('blue', 'brown')
for(i in 1:nrow(mResp)){
  lines(mResp[i,], col=cols[i], type='b', pch=16)
}
legend('topleft', lty=1, pch=16, col=cols, legend=c('First 200 Trials', 'Last 200 Trials'), bty='n')
text(9.5, 0, paste0('N = ', N))

dev.off()

# Model -------------------------------------------------------------------

library(lme4)

choice$trial0 = choice$trial/max(choice$trial)
choice$trial0c = choice$trial0 - 0.5
choice$intensity0 = choice$intensity/max(choice$intensity)
choice$intensity0c = choice$intensity0 - 0.5

m0=glmer(response~1+(1|ID), data=choice, family='binomial')
# m1=glmer(response~trial0+(1|ID), data=choice, family='binomial')
m1=glmer(response~intensity0c+(1|ID), data=choice, family='binomial')
m2=glmer(response~trial0c+intensity0+(1|ID), data=choice, family='binomial')
m3=glmer(response~trial0c*intensity0c+(1|ID), data=choice, family='binomial')

anova(m3, m2, m1, m0) 
summary(m3)

