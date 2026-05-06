import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const actionOrder = ["ver", "agregar", "editar", "eliminar"];

const getPermissionMap = (permissionGroups = []) => {
  const map = {};
  permissionGroups.forEach((group) => {
    map[group.module] = {};
    (group.permissions || []).forEach((permission) => {
      map[group.module][permission.action] = permission;
    });
  });
  return map;
};

export const normalizePermissionSelection = (permissionGroups = [], selectedIds = []) => {
  const selectedSet = new Set((selectedIds || []).map(String));
  const permissionMap = getPermissionMap(permissionGroups);

  permissionGroups.forEach((group) => {
    const viewPermission = permissionMap[group.module]?.ver;
    const hasNonViewSelected = actionOrder
      .filter((action) => action !== "ver")
      .some((action) => {
        const permission = permissionMap[group.module]?.[action];
        return permission && selectedSet.has(String(permission.id_str || permission._id));
      });

    if (hasNonViewSelected && viewPermission) {
      selectedSet.add(String(viewPermission.id_str || viewPermission._id));
    }

    if (viewPermission && !selectedSet.has(String(viewPermission.id_str || viewPermission._id))) {
      actionOrder
        .filter((action) => action !== "ver")
        .forEach((action) => {
          const permission = permissionMap[group.module]?.[action];
          if (permission) {
            selectedSet.delete(String(permission.id_str || permission._id));
          }
        });
    }
  });

  return Array.from(selectedSet);
};

export const PermissionMatrix = ({
  title,
  subtitle = "",
  permissionGroups = [],
  selectedIds = [],
  disabled = false,
  onChange,
}) => {
  const selectedSet = new Set((selectedIds || []).map(String));
  const permissionMap = getPermissionMap(permissionGroups);

  const updateSelection = (nextSet) => {
    onChange(normalizePermissionSelection(permissionGroups, Array.from(nextSet)));
  };

  const togglePermission = (module, action, checked) => {
    const permission = permissionMap[module]?.[action];
    if (!permission) return;

    const nextSet = new Set(selectedSet);
    const permissionId = String(permission.id_str || permission._id);

    if (checked) {
      nextSet.add(permissionId);
      if (action !== "ver" && permissionMap[module]?.ver) {
        nextSet.add(String(permissionMap[module].ver.id_str || permissionMap[module].ver._id));
      }
    } else {
      nextSet.delete(permissionId);
      if (action === "ver") {
        actionOrder
          .filter((currentAction) => currentAction !== "ver")
          .forEach((currentAction) => {
            const currentPermission = permissionMap[module]?.[currentAction];
            if (currentPermission) {
              nextSet.delete(String(currentPermission.id_str || currentPermission._id));
            }
          });
      }
    }

    updateSelection(nextSet);
  };

  const toggleModule = (module, checked) => {
    const nextSet = new Set(selectedSet);
    actionOrder.forEach((action) => {
      const permission = permissionMap[module]?.[action];
      if (!permission) return;
      const permissionId = String(permission.id_str || permission._id);
      if (checked) {
        nextSet.add(permissionId);
      } else {
        nextSet.delete(permissionId);
      }
    });
    updateSelection(nextSet);
  };

  return (
    <Paper elevation={3} sx={{ marginBottom: 2 }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box>
            <Typography variant="h6">{title}</Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {permissionGroups.map((group) => {
              const modulePermissions = permissionMap[group.module] || {};
              const moduleIds = Object.values(modulePermissions).map((permission) =>
                String(permission.id_str || permission._id),
              );
              const moduleChecked =
                moduleIds.length > 0 &&
                moduleIds.every((permissionId) => selectedSet.has(permissionId));

              return (
                <Box
                  key={group.module}
                  sx={{
                    padding: 2,
                    borderRadius: 2,
                    backgroundColor: "#f7f9fb",
                    border: "1px solid #d9e1ea",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    justifyContent="space-between"
                    spacing={1}
                    sx={{ marginBottom: 1 }}
                  >
                    <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
                      {group.module.replaceAll("_", " ")}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={moduleChecked}
                          disabled={disabled}
                          onChange={(event) =>
                            toggleModule(group.module, event.target.checked)
                          }
                        />
                      }
                      label="Todos"
                    />
                  </Stack>
                  <Grid container spacing={1}>
                    {actionOrder.map((action) => {
                      const permission = modulePermissions[action];
                      if (!permission) return null;
                      const permissionId = String(permission.id_str || permission._id);
                      return (
                        <Grid item xs={12} sm={6} md={3} key={permissionId}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedSet.has(permissionId)}
                                disabled={disabled}
                                onChange={(event) =>
                                  togglePermission(
                                    group.module,
                                    action,
                                    event.target.checked,
                                  )
                                }
                              />
                            }
                            label={action.charAt(0).toUpperCase() + action.slice(1)}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              );
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};
