namespace R6MatchFinder.Common.Utility
{
    public static class Enums
    {

    }

    [PublicEnum]
    public enum Platform
    {
        XboxOne,
        Playstation4,
        UPlay
    }

    [PublicEnum]
    public enum Region
    {
        EusRegion,
        CusRegion,
        ScusRegion,
        WusRegion,
        WeuRegion,
        EeuRegion,
        SeasRegion,
        SbrRegion,
        WjaRegion,
        EasRegion,
        NeuRegion,
        EauRegion
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
        Minimal,
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
