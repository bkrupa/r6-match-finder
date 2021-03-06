﻿using R6MatchFinder.Common.Database.Abstracts;
using R6MatchFinder.Common.Database.Interfaces;

namespace R6MatchFinder.Common.Database.Model
{
    public class GameModeSettings : AbstractModeSettings<Game>, MapTo<ActiveGameModeSettings>
    {
    }
}
