package io.papermc.hangar.model.common.roles;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.papermc.hangar.db.customtypes.RoleCategory;
import io.papermc.hangar.model.common.Color;
import io.papermc.hangar.model.common.Permission;
import io.papermc.hangar.model.db.roles.OrganizationRoleTable;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.postgresql.shaded.com.ongres.scram.common.util.Preconditions;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum OrganizationRole implements Role<OrganizationRoleTable> {

    ORGANIZATION_SUPPORT("Organization_Support", 28, Permission.PostAsOrganization.add(Permission.IsOrganizationMember), "Support", Color.TRANSPARENT),
    ORGANIZATION_EDITOR("Organization_Editor", 27, ProjectRole.PROJECT_EDITOR.getPermissions().add(ORGANIZATION_SUPPORT.permissions), "Editor", Color.TRANSPARENT),
    ORGANIZATION_DEVELOPER("Organization_Developer", 26, Permission.CreateProject.add(Permission.EditProjectSettings).add(ProjectRole.PROJECT_DEVELOPER.getPermissions()).add(ORGANIZATION_EDITOR.permissions), "Developer", Color.TRANSPARENT),
    ORGANIZATION_ADMIN("Organization_Admin", 25, Permission.EditApiKeys.add(Permission.ManageProjectMembers).add(Permission.EditOwnUserSettings).add(Permission.DeleteProject).add(Permission.DeleteVersion).add(ORGANIZATION_DEVELOPER.permissions), "Admin", Color.TRANSPARENT),
    ORGANIZATION_OWNER("Organization_Owner", 24, Permission.IsOrganizationOwner.add(ProjectRole.PROJECT_OWNER.getPermissions()).add(ORGANIZATION_ADMIN.permissions), "Owner", Color.PURPLE, false);

    private final String value;
    private final long roleId;
    private final Permission permissions;
    private final String title;
    private final Color color;
    private final boolean isAssignable;

    private final static OrganizationRole[] VALUES = values();
    private final static List<OrganizationRole> ASSIGNABLE_ROLES = Arrays.stream(VALUES).filter(OrganizationRole::isAssignable).collect(Collectors.toList());

    public static OrganizationRole[] getValues() { return VALUES; }
    public static List<OrganizationRole> getAssignableRoles() { return ASSIGNABLE_ROLES; }

    OrganizationRole(String value, long roleId, Permission permissions, String title, Color color) {
        this(value, roleId, permissions, title, color, true);
    }

    OrganizationRole(String value, long roleId, Permission permissions, String title, Color color, boolean isAssignable) {
        this.value = value;
        this.roleId = roleId;
        this.permissions = permissions;
        this.title = title;
        this.color = color;
        this.isAssignable = isAssignable;
        Role.registerRole(this);
    }

    @NotNull
    @Override
    public String getValue() {
        return value;
    }

    @Override
    public long getRoleId() {
        return roleId;
    }

    @NotNull
    @Override
    public RoleCategory getRoleCategory() {
        return RoleCategory.ORGANIZATION;
    }

    @NotNull
    @Override
    public Permission getPermissions() {
        return permissions;
    }

    @NotNull
    @Override
    public String getTitle() {
        return title;
    }

    @NotNull
    @Override
    public Color getColor() {
        return color;
    }

    @Override
    public boolean isAssignable() {
        return isAssignable;
    }

    @Nullable
    @Override
    @JsonIgnore
    public Integer getRank() {
        return Role.super.getRank();
    }

    @Override
    public @NotNull OrganizationRoleTable create(Long organizationId, long userId, boolean isAccepted) {
        Preconditions.checkNotNull(organizationId, "organization id");
        return new OrganizationRoleTable(userId, this, isAccepted, organizationId);
    }
}
