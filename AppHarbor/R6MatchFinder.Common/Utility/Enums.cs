﻿namespace R6MatchFinder.Common.Utility
{
    public static class Enums
    {

    }

    [PublicEnum]
    public enum Gender
    {
        Male,
        Female
    }

    public enum Roles
    {
        User,
        Administrator
    }

    [PublicEnum]
    public enum RuleSet
    {
        Standard,
        TacticalRealism
    }

    [PublicEnum]
    public enum TimeOfDay
    {
        Day,
        Night
    }

    [PublicEnum]
    public enum HudSettings
    {
        Standard,
        ProLeague
    }

    [PublicEnum]
    public enum GameMode
    {
        Bomb,
        Hostage,
        SecureArea
    }
}
